import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { read as xlsxRead, utils as xlsxUtils } from 'xlsx'

const env = readFileSync('.env.local', 'utf8')
const get = (k) => { const m = env.match(new RegExp(k + '=(.+)')); return m ? m[1].trim() : null }
const url = get('NEXT_PUBLIC_SUPABASE_URL')
const key = get('SUPABASE_SERVICE_ROLE_KEY')
if (!url || !key) { console.log('❌ Missing env vars'); process.exit(1) }

const supabase = createClient(url, key)

const FERIAL_CYCLES = new Set(['I', 'II'])
const VALID_SEASONS = new Set(['ordinary', 'advent', 'christmas', 'lent', 'easter'])
const VALID_LANGS = new Set(['es', 'en'])
const EXCEL_PATH = '/home/betoyac/LITTLECLARAVALCONTENIDO MASTER.xlsx'
const BATCH_SIZE = 50

const rowKey = (cycle, season, week, weekday, feast_key, lang) =>
  `${cycle}|${season}|${week ?? 'NULL'}|${weekday ?? 'NULL'}|${feast_key}|${lang}`

async function main() {
  // Step 1: Confirm no constraint blocks I/II
  console.log('=== Step 1: Check cycle constraint ===\n')
  const { error: testErr } = await supabase.from('lectionary').insert({
    cycle: 'I', season: 'ordinary', week: 9999, weekday: 1,
    feast_key: '__constraint_probe__', lang: 'es', gospel_ref: 'probe'
  })
  if (testErr) {
    console.log('❌ Constraint or error blocks I/II insert:', testErr.message)
    console.log('\nSQL to fix — run in Supabase Dashboard > SQL Editor:')
    console.log(`ALTER TABLE lectionary DROP CONSTRAINT IF EXISTS lectionary_cycle_check;`)
    console.log(`ALTER TABLE lectionary ADD CONSTRAINT lectionary_cycle_check`)
    console.log(`  CHECK (cycle IN ('A','B','C','FIXED','I','II'));`)
    process.exit(1)
  }
  // Clean up probe row
  await supabase.from('lectionary').delete().eq('feast_key', '__constraint_probe__')
  console.log('✅ No CHECK constraint blocking I/II — test insert succeeded and cleaned up.\n')

  // Step 2: Read Excel and filter ferial rows
  console.log('=== Step 2: Import ferial rows ===\n')

  const fileBuffer = readFileSync(EXCEL_PATH)
  const workbook = xlsxRead(fileBuffer)
  const sheet = workbook.Sheets['lecturas']
  if (!sheet) {
    console.log('❌ Sheet "lecturas" not found. Sheets:', workbook.SheetNames.join(', '))
    process.exit(1)
  }

  const allRows = xlsxUtils.sheet_to_json(sheet, { defval: null })
  console.log(`Total rows in Excel: ${allRows.length}`)

  const validRows = []
  let skippedInvalid = 0

  for (const row of allRows) {
    const cycle = row.cycle != null ? String(row.cycle).trim() : null
    const season = row.season != null ? String(row.season).trim() : null
    const lang = row.lang != null ? String(row.lang).trim() : null

    if (!FERIAL_CYCLES.has(cycle) || !VALID_SEASONS.has(season) || !VALID_LANGS.has(lang)) {
      skippedInvalid++
      continue
    }
    validRows.push(row)
  }

  console.log(`Ferial rows (cycle I/II, valid season+lang): ${validRows.length}`)
  console.log(`Skipped (not ferial or invalid): ${skippedInvalid}`)

  // Fetch all existing ferial keys from DB
  console.log('Fetching existing ferial rows from DB...')
  const existingKeys = new Set()
  let page = 0
  const PAGE_SIZE = 1000
  while (true) {
    const { data, error } = await supabase
      .from('lectionary')
      .select('cycle,season,week,weekday,feast_key,lang')
      .in('cycle', ['I', 'II'])
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (error) { console.log('❌ Error fetching existing rows:', error.message); process.exit(1) }
    if (!data || data.length === 0) break
    for (const r of data) {
      existingKeys.add(rowKey(r.cycle, r.season, r.week, r.weekday, r.feast_key ?? '', r.lang))
    }
    if (data.length < PAGE_SIZE) break
    page++
  }
  console.log(`Existing ferial rows in DB: ${existingKeys.size}`)

  // Separate new from existing
  const toInsert = []
  let alreadyInDB = 0

  for (const row of validRows) {
    const cycle = String(row.cycle).trim()
    const season = String(row.season).trim()
    const week = row.week != null ? Number(row.week) : null
    const weekday = row.weekday != null ? Number(row.weekday) : null
    const feast_key = row.feast_key != null ? String(row.feast_key).trim() : ''
    const lang = String(row.lang).trim()

    if (existingKeys.has(rowKey(cycle, season, week, weekday, feast_key, lang))) {
      alreadyInDB++
    } else {
      toInsert.push({
        cycle, season, week, weekday, feast_key, lang,
        title: row.title != null ? String(row.title).trim() : null,
        liturgical_color: row.liturgical_color != null ? String(row.liturgical_color).trim() : null,
        first_reading_ref: row.first_reading_ref != null ? String(row.first_reading_ref).trim() : null,
        first_reading_text: row.first_reading_text != null ? String(row.first_reading_text) : null,
        psalm_ref: row.psalm_ref != null ? String(row.psalm_ref).trim() : null,
        psalm_text: row.psalm_text != null ? String(row.psalm_text) : null,
        second_reading_ref: row.second_reading_ref != null ? String(row.second_reading_ref).trim() : null,
        second_reading_text: row.second_reading_text != null ? String(row.second_reading_text) : null,
        gospel_ref: row.gospel_ref != null ? String(row.gospel_ref).trim() : null,
        gospel_text: row.gospel_text != null ? String(row.gospel_text) : null,
      })
    }
  }

  console.log(`Already in DB: ${alreadyInDB}`)
  console.log(`To insert: ${toInsert.length}\n`)

  let inserted = 0
  let insertErrors = 0

  if (toInsert.length === 0) {
    console.log('Nothing to insert.')
  } else {
    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
      const batch = toInsert.slice(i, i + BATCH_SIZE)
      const { error } = await supabase.from('lectionary').insert(batch)
      if (error) {
        console.log(`\n❌ Batch error (rows ${i}–${i + batch.length - 1}): ${error.message}`)
        for (const rec of batch) {
          const { error: e2 } = await supabase.from('lectionary').insert(rec)
          if (e2) {
            console.log(`  ↳ Failed: ${rowKey(rec.cycle, rec.season, rec.week, rec.weekday, rec.feast_key, rec.lang)} — ${e2.message}`)
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
    console.log('')
  }

  // Total in DB after
  const { count: total, error: countErr } = await supabase
    .from('lectionary')
    .select('*', { count: 'exact', head: true })

  console.log('\n=== Summary ===')
  console.log(`Ferial rows in Excel:        ${validRows.length}`)
  console.log(`Rows already in DB:          ${alreadyInDB}`)
  console.log(`Rows inserted:               ${inserted}`)
  if (insertErrors > 0) console.log(`Insert errors:               ${insertErrors}`)
  console.log(`Total in DB after:           ${countErr ? '(error: ' + countErr.message + ')' : total}`)
}

main().catch(console.error)
