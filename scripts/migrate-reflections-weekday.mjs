import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { read as xlsxRead, utils as xlsxUtils } from 'xlsx'

const EXCEL_PATH = '/home/betoyac/LITTLECLARAVALCONTENIDO MASTER.xlsx'
const BATCH_SIZE = 50
const VALID_CYCLES = new Set(['A', 'B', 'C', 'I', 'II', 'FIXED'])
const VALID_LANGS  = new Set(['es', 'en'])

// ─── Load env ────────────────────────────────────────────────────────────────
const env = readFileSync('.env.local', 'utf8')
const get = (k) => { const m = env.match(new RegExp(k + '=(.+)')); return m ? m[1].trim() : null }
const url = get('NEXT_PUBLIC_SUPABASE_URL')
const key = get('SUPABASE_SERVICE_ROLE_KEY')
if (!url || !key) { console.error('❌ Missing SUPABASE env vars'); process.exit(1) }
const supabase = createClient(url, key)

function ddlInstructions() {
  console.error('\nRun scripts/migration-reflections-weekday.sql in the Supabase Dashboard')
  console.error('  → Dashboard → SQL Editor → paste and run the file contents\n')
  console.error('Then re-run this script.')
}

// ─── Step 1: Probe — weekday column + constraint ──────────────────────────────
async function step1_probe() {
  console.log('\n=== STEP 1: Check weekday column + unique constraint ===')

  const PROBE_KEY = '__ck_probe__'

  // Insert probe row 1 — tests weekday column existence
  const { error: e1 } = await supabase
    .from('lectionary_reflections')
    .insert({ cycle: '__probe__', season: 'ordinary', week: 9997, weekday: 1,
               feast_key: PROBE_KEY, lang: 'es', gospel_ref: 'probe1' })

  if (e1 && e1.code === 'PGRST204') {
    console.error('❌ Column "weekday" does not exist in lectionary_reflections.')
    ddlInstructions()
    process.exit(1)
  }
  if (e1) { console.error('❌ Unexpected error on probe-1 insert:', e1.message); process.exit(1) }

  // Insert probe row 2 — same (cycle,season,week,feast_key,lang) but weekday=2
  // If old constraint (without weekday) still exists, this will fail with 23505
  const { error: e2 } = await supabase
    .from('lectionary_reflections')
    .insert({ cycle: '__probe__', season: 'ordinary', week: 9997, weekday: 2,
               feast_key: PROBE_KEY, lang: 'es', gospel_ref: 'probe2' })

  // Clean up probe rows regardless
  await supabase.from('lectionary_reflections').delete().eq('feast_key', PROBE_KEY)

  if (e2 && e2.code === '23505') {
    // Any unique violation here means a constraint without weekday is still present
    const constraintName = (e2.message.match(/constraint "([^"]+)"/) || [])[1] || 'unknown'
    console.error(`❌ Old unique constraint (without weekday) still exists: "${constraintName}"`)
    console.error('Run migration-reflections-weekday.sql again — it now drops both known old constraints.')
    ddlInstructions()
    process.exit(1)
  }
  if (e2) { console.error('❌ Unexpected error on probe-2 insert:', e2.message); process.exit(1) }

  console.log('✅ weekday column exists, new unique constraint is in place')
}

// ─── Step 2: Delete all rows ──────────────────────────────────────────────────
async function step2_deleteAllRows() {
  console.log('\n=== STEP 2: Delete all existing rows ===')

  let totalDeleted = 0

  // Delete rows for each valid cycle
  for (const cycle of ['A', 'B', 'C', 'I', 'II', 'FIXED']) {
    const { count, error } = await supabase
      .from('lectionary_reflections')
      .delete({ count: 'exact' })
      .eq('cycle', cycle)
    if (error) { console.error(`❌ Error deleting cycle=${cycle}: ${error.message}`); process.exit(1) }
    const n = count ?? 0
    if (n > 0) console.log(`  Deleted ${n} rows where cycle=${cycle}`)
    totalDeleted += n
  }

  // Delete remaining corrupted rows (invalid cycle values) via server-side NOT IN
  const { count: corruptDeleted, error: corruptErr } = await supabase
    .from('lectionary_reflections')
    .delete({ count: 'exact' })
    .not('cycle', 'in', '(A,B,C,I,II,FIXED)')
  if (corruptErr) { console.error('❌ Error deleting corrupt rows:', corruptErr.message); process.exit(1) }

  if ((corruptDeleted ?? 0) > 0) console.log(`  Deleted ${corruptDeleted} corrupted rows`)
  totalDeleted += corruptDeleted
  console.log(`✅ Total deleted: ${totalDeleted}`)
}

// ─── Step 3: Import from Excel ────────────────────────────────────────────────
async function step3_importFromExcel() {
  console.log('\n=== STEP 3: Import from Excel (reflexiones sheet) ===')

  const fileBuffer = readFileSync(EXCEL_PATH)
  const workbook   = xlsxRead(fileBuffer)
  const sheet      = workbook.Sheets['reflexiones']
  if (!sheet) {
    console.error('❌ Sheet "reflexiones" not found. Sheets:', workbook.SheetNames.join(', '))
    process.exit(1)
  }

  const allRows = xlsxUtils.sheet_to_json(sheet, { defval: null })
  console.log(`Rows read from Excel: ${allRows.length}`)

  const seen = new Set()
  const toInsert = []
  let skippedInvalid   = 0
  let skippedReflexion = 0
  let skippedDup       = 0

  for (const row of allRows) {
    const cycle  = row.cycle  != null ? String(row.cycle).trim()  : null
    const lang   = row.lang   != null ? String(row.lang).trim()   : null
    const season = row.season != null ? String(row.season).trim() : null

    if (!VALID_CYCLES.has(cycle) || !VALID_LANGS.has(lang)) {
      skippedInvalid++
      continue
    }

    const reflexion = row.reflexion != null ? String(row.reflexion).trim() : null
    if (!reflexion || reflexion === '#') {
      skippedReflexion++
      continue
    }

    const week      = row.week    != null ? Math.round(Number(row.week))    : null
    const weekday   = row.weekday != null ? Math.round(Number(row.weekday)) : null
    const feast_key = row.feast_key != null ? String(row.feast_key).trim()  : ''

    const dedupeKey = `${cycle}|${season}|${week}|${weekday}|${feast_key}|${lang}`
    if (seen.has(dedupeKey)) {
      skippedDup++
      continue
    }
    seen.add(dedupeKey)

    const tags = row.tags != null
      ? String(row.tags).split(',').map(s => s.trim()).filter(Boolean)
      : []

    toInsert.push({
      cycle, season, week, weekday, feast_key, lang,
      title:            row.title            != null ? String(row.title).trim()            : null,
      liturgical_color: row.liturgical_color != null ? String(row.liturgical_color).trim() : null,
      gospel_ref:       row.gospel_ref       != null ? String(row.gospel_ref).trim()       : null,
      gospel_text:      row.gospel_text      != null ? String(row.gospel_text)             : null,
      reflexion:        String(row.reflexion),
      silence:          row.silence          != null ? String(row.silence)                 : null,
      meditative_phrase: row.meditative_phrase != null ? String(row.meditative_phrase)     : null,
      inner_question:   row.inner_question   != null ? String(row.inner_question)          : null,
      brief_prayer:     row.brief_prayer     != null ? String(row.brief_prayer)            : null,
      spiritual_school: row.spiritual_school != null ? String(row.spiritual_school).trim() : null,
      theme:            row.theme            != null ? String(row.theme).trim()            : null,
      tags,
    })
  }

  console.log(`Valid unique rows to insert: ${toInsert.length}`)
  console.log(`Skipped (invalid cycle/lang): ${skippedInvalid}`)
  console.log(`Skipped (null/# reflexion):   ${skippedReflexion}`)
  console.log(`Skipped (duplicates):         ${skippedDup}`)

  let inserted     = 0
  let insertErrors = 0

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('lectionary_reflections').insert(batch)

    if (error) {
      process.stdout.write('\n')
      console.error(`❌ Batch error (rows ${i}–${i + batch.length - 1}): ${error.message}`)
      // Retry individually to isolate failures
      for (const rec of batch) {
        const { error: e2 } = await supabase.from('lectionary_reflections').insert(rec)
        if (e2) {
          console.error(`  ↳ Failed: ${rec.cycle}|${rec.season}|${rec.week}|${rec.weekday}|${rec.feast_key}|${rec.lang} — ${e2.message}`)
          insertErrors++
        } else {
          inserted++
        }
      }
    } else {
      inserted += batch.length
    }

    process.stdout.write(`\rInserting... ${Math.min(i + BATCH_SIZE, toInsert.length)}/${toInsert.length}`)
  }

  process.stdout.write('\n')

  const { count: total, error: cntErr } = await supabase
    .from('lectionary_reflections')
    .select('*', { count: 'exact', head: true })

  console.log('\n=== Import Summary ===')
  console.log(`Rows in Excel:                ${allRows.length}`)
  console.log(`Skipped (invalid):            ${skippedInvalid}`)
  console.log(`Skipped (null/# reflexion):   ${skippedReflexion}`)
  console.log(`Skipped (duplicates):         ${skippedDup}`)
  console.log(`Inserted:                     ${inserted}`)
  if (insertErrors > 0) console.log(`Insert errors:                ${insertErrors}`)
  console.log(`Total in DB after:            ${cntErr ? '(error: ' + cntErr.message + ')' : total}`)
}

// ─── Step 5: Verify gospel_refs ────────────────────────────────────────────────
async function step5_verifyGospelRefs() {
  console.log('\n=== STEP 5: Verify gospel_refs (cycle A + II + FIXED, lang=es) ===')

  const PAGE = 1000

  // Fetch reflection rows for current liturgical year cycles
  const reflRows = []
  let offset = 0
  while (true) {
    const { data, error } = await supabase
      .from('lectionary_reflections')
      .select('cycle,season,week,weekday,feast_key,lang,gospel_ref')
      .in('cycle', ['A', 'II', 'FIXED'])
      .eq('lang', 'es')
      .eq('feast_key', '')
      .range(offset, offset + PAGE - 1)
    if (error) { console.error('❌ Error fetching reflections:', error.message); return }
    if (!data || data.length === 0) break
    reflRows.push(...data)
    if (data.length < PAGE) break
    offset += PAGE
  }
  console.log(`Reflection rows (non-feast):  ${reflRows.length}`)

  // Fetch lectionary rows for same cycles
  const lectRows = []
  offset = 0
  while (true) {
    const { data, error } = await supabase
      .from('lectionary')
      .select('cycle,season,week,weekday,feast_key,lang,gospel_ref')
      .in('cycle', ['A', 'II', 'FIXED'])
      .eq('lang', 'es')
      .eq('feast_key', '')
      .range(offset, offset + PAGE - 1)
    if (error) { console.error('❌ Error fetching lectionary:', error.message); return }
    if (!data || data.length === 0) break
    lectRows.push(...data)
    if (data.length < PAGE) break
    offset += PAGE
  }
  console.log(`Lectionary rows (non-feast):  ${lectRows.length}`)

  // Build lectionary lookup: cycle|season|week|weekday|lang → gospel_ref
  const lectMap = new Map()
  for (const r of lectRows) {
    const k = `${r.cycle}|${r.season}|${r.week}|${r.weekday}|${r.lang}`
    lectMap.set(k, r.gospel_ref)
  }

  let matches   = 0
  let mismatches = 0
  let noLectRow  = 0
  const mismatchList = []

  for (const r of reflRows) {
    const k = `${r.cycle}|${r.season}|${r.week}|${r.weekday}|${r.lang}`
    const lectGospel = lectMap.get(k)

    if (lectGospel === undefined) {
      noLectRow++
    } else if (lectGospel !== r.gospel_ref) {
      mismatches++
      mismatchList.push({ key: k, refl: r.gospel_ref, lect: lectGospel })
    } else {
      matches++
    }
  }

  console.log('\nResults:')
  console.log(`  Matches:              ${matches}`)
  console.log(`  Mismatches:           ${mismatches}`)
  console.log(`  No matching lect row: ${noLectRow}`)

  if (mismatchList.length > 0) {
    console.log('\nMismatches (first 30):')
    for (const m of mismatchList.slice(0, 30)) {
      console.log(`  ${m.key}`)
      console.log(`    reflection:  ${m.refl}`)
      console.log(`    lectionary:  ${m.lect}`)
    }
  } else if (mismatches === 0) {
    console.log('\n✅ All gospel_refs match!')
  }

  if (noLectRow > 0) {
    console.log(`\n  ⚠️  ${noLectRow} reflection rows have no matching lectionary row`)
    console.log('     (FIXED ferial days for advent/lent/easter may not be in lectionary — expected)')
  }
}

async function main() {
  await step1_probe()
  await step2_deleteAllRows()
  await step3_importFromExcel()
  await step5_verifyGospelRefs()
  console.log('\n✅ Migration complete.')
}

main().catch(err => {
  console.error('\nFatal error:', err)
  process.exit(1)
})
