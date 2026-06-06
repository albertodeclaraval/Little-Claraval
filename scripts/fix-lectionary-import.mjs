import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { read as xlsxRead, utils as xlsxUtils } from 'xlsx'

// Load env
const env = readFileSync('.env.local', 'utf8')
const get = (key) => { const m = env.match(new RegExp(key + '=(.+)')); return m ? m[1].trim() : null }
const url = get('NEXT_PUBLIC_SUPABASE_URL')
const key = get('SUPABASE_SERVICE_ROLE_KEY')
if (!url || !key) { console.log('❌ Missing env vars'); process.exit(1) }

const supabase = createClient(url, key)

const VALID_CYCLES = new Set(['A', 'B', 'C', 'FIXED'])
const VALID_SEASONS = new Set(['ordinary', 'advent', 'christmas', 'lent', 'easter'])
const VALID_LANGS = new Set(['es', 'en'])
const EXCEL_PATH = '/home/betoyac/LITTLECLARAVALCONTENIDO MASTER.xlsx'
const BATCH_SIZE = 50

const rowKey = (cycle, season, week, weekday, feast_key, lang) =>
  `${cycle}|${season}|${week ?? 'NULL'}|${weekday ?? 'NULL'}|${feast_key}|${lang}`

// ─── Step 1: Delete corrupt rows ─────────────────────────────────────────────

async function step1() {
  console.log('\n=== STEP 1: Delete corrupt rows ===\n')

  const { count: countCycle, error: err1 } = await supabase
    .from('lectionary')
    .delete({ count: 'exact' })
    .in('cycle', ['I', 'II'])

  if (err1) { console.log('❌ Error deleting by cycle:', err1.message); process.exit(1) }
  console.log(`Deleted ${countCycle ?? 0} rows where cycle IN ('I','II')`)

  // Fetch remaining rows with invalid season
  const { data: badSeasonRows, error: err2 } = await supabase
    .from('lectionary')
    .select('id')
    .not('season', 'in', '(ordinary,advent,christmas,lent,easter)')

  if (err2) { console.log('❌ Error querying bad seasons:', err2.message); process.exit(1) }

  let countSeason = 0
  if (badSeasonRows && badSeasonRows.length > 0) {
    const ids = badSeasonRows.map(r => r.id)
    const { count, error: delErr } = await supabase
      .from('lectionary')
      .delete({ count: 'exact' })
      .in('id', ids)
    if (delErr) { console.log('❌ Error deleting bad seasons:', delErr.message); process.exit(1) }
    countSeason = count ?? 0
  }
  console.log(`Deleted ${countSeason} rows where season NOT IN valid seasons`)

  console.log(`\nStep 1 complete. Total deleted: ${(countCycle ?? 0) + countSeason}`)
}

// ─── Step 2: Import from Excel ────────────────────────────────────────────────

async function step2() {
  console.log('\n=== STEP 2: Import from Excel ===\n')

  // Read Excel
  const fileBuffer = readFileSync(EXCEL_PATH)
  const workbook = xlsxRead(fileBuffer)
  const sheet = workbook.Sheets['lecturas']
  if (!sheet) {
    console.log('❌ Sheet "lecturas" not found. Available sheets:', workbook.SheetNames.join(', '))
    process.exit(1)
  }

  const rows = xlsxUtils.sheet_to_json(sheet, { defval: null })
  console.log(`Rows read from Excel: ${rows.length}`)

  // Filter valid rows
  const validRows = []
  let skippedInvalid = 0

  for (const row of rows) {
    const cycle = row.cycle != null ? String(row.cycle).trim() : null
    const season = row.season != null ? String(row.season).trim() : null
    const lang = row.lang != null ? String(row.lang).trim() : null

    if (!VALID_CYCLES.has(cycle) || !VALID_SEASONS.has(season) || !VALID_LANGS.has(lang)) {
      skippedInvalid++
      continue
    }
    validRows.push(row)
  }

  console.log(`Valid rows: ${validRows.length}`)
  console.log(`Skipped (invalid cycle/season/lang): ${skippedInvalid}`)

  // Fetch all existing keys from DB (paginated)
  console.log('Fetching existing rows from DB...')
  const existingKeys = new Set()
  let page = 0
  const PAGE_SIZE = 1000
  while (true) {
    const { data, error } = await supabase
      .from('lectionary')
      .select('cycle,season,week,weekday,feast_key,lang')
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (error) { console.log('❌ Error fetching existing rows:', error.message); process.exit(1) }
    if (!data || data.length === 0) break

    for (const r of data) {
      existingKeys.add(rowKey(r.cycle, r.season, r.week, r.weekday, r.feast_key ?? '', r.lang))
    }

    if (data.length < PAGE_SIZE) break
    page++
  }
  console.log(`Existing rows in DB: ${existingKeys.size}`)

  // Separate new rows from already-existing
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
  console.log(`To insert: ${toInsert.length}`)

  // Insert in batches
  let inserted = 0
  let insertErrors = 0

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('lectionary').insert(batch)
    if (error) {
      console.log(`\n❌ Batch insert error (rows ${i}–${i + batch.length}): ${error.message}`)
      insertErrors += batch.length
    } else {
      inserted += batch.length
    }
    process.stdout.write(`\rInserting... ${Math.min(i + BATCH_SIZE, toInsert.length)}/${toInsert.length}`)
  }

  // Count total in DB after
  const { count: totalAfter, error: countErr } = await supabase
    .from('lectionary')
    .select('*', { count: 'exact', head: true })

  console.log('\n')
  console.log('=== Import Summary ===')
  console.log(`Rows read from Excel:        ${rows.length}`)
  console.log(`Rows skipped (invalid):      ${skippedInvalid}`)
  console.log(`Rows already in DB:          ${alreadyInDB}`)
  console.log(`Rows inserted:               ${inserted}`)
  if (insertErrors > 0) console.log(`Insert errors:               ${insertErrors}`)
  console.log(`Total in DB after:           ${countErr ? '(error: ' + countErr.message + ')' : totalAfter}`)
}

async function main() {
  await step1()
  await step2()
}

main().catch(console.error)
