import { createClient } from '@supabase/supabase-js'

var supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
var ADMIN_EMAILS = ['betoyac@gmail.com', 'albertodeclaraval@gmail.com']

function parseCSVLine(line) {
  var result = [], current = '', inQuotes = false
  for (var i = 0; i < line.length; i++) {
    var c = line[i]
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else { inQuotes = !inQuotes }
    } else if (c === ',' && !inQuotes) {
      result.push(current); current = ''
    } else { current += c }
  }
  result.push(current)
  return result
}

function parseCSV(text) {
  var lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  var headers = parseCSVLine(lines[0]).map(function(h) { return h.trim() })
  var rows = []
  for (var i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    var values = parseCSVLine(lines[i])
    var row = {}
    for (var j = 0; j < headers.length; j++) {
      var h = headers[j]
      if (!h) continue
      var v = values[j] !== undefined ? values[j].trim() : ''
      // Duplicate header: keep first non-empty value (e.g. reflexiones has two feast_key columns)
      if (!(h in row) || (row[h] === '' && v !== '')) row[h] = v
    }
    rows.push(row)
  }
  return rows
}

function toIntOrNull(v) { var n = parseInt(v); return isNaN(n) ? null : n }
function toNumOrDefault(v, def) { var n = parseFloat(v); return isNaN(n) ? def : n }
function clean(v) { return (v && v.trim()) ? v.trim() : null }

// santos → saints (upsert on month_day)
// Excel cols: month_day, name_es, name_en, bio_es, bio_en, patronage_es, patronage_en,
//             birth_year, death_year, canonization_year, canonized_by,
//             feast_day_es, feast_day_en, prayer_es, prayer_en, rank, tags
async function importSantos(rows) {
  var mapped = rows.filter(function(r) { return r.month_day }).map(function(r) {
    return {
      month_day: r.month_day,
      name_es: clean(r.name_es), name_en: clean(r.name_en),
      bio_es: clean(r.bio_es), bio_en: clean(r.bio_en),
      patronage_es: clean(r.patronage_es), patronage_en: clean(r.patronage_en),
      birth_year: toIntOrNull(r.birth_year), death_year: toIntOrNull(r.death_year),
      canonization_year: toIntOrNull(r.canonization_year), canonized_by: clean(r.canonized_by),
      feast_day_es: clean(r.feast_day_es), feast_day_en: clean(r.feast_day_en),
      prayer_es: clean(r.prayer_es), prayer_en: clean(r.prayer_en),
      rank: (clean(r.rank) || 'memorial').toLowerCase().replace(/ /g, '_'),
      tags: r.tags ? r.tags.split(',').map(function(t) { return t.trim() }) : []
    }
  })
  if (mapped.length === 0) return { count: 0, error: 'No hay filas validas' }
  var { error } = await supabaseAdmin.from('saints').upsert(mapped, { onConflict: 'month_day' })
  return { count: mapped.length, error: error ? error.message : null }
}

// lecturas → lectionary (upsert on cycle,season,week,weekday,feast_key,lang)
// Excel cols: cycle, season, week, weekday, feast_key, lang, title, liturgical_color,
//             first_reading_ref, first_reading_text, psalm_ref, psalm_text,
//             second_reading_ref, second_reading_text, gospel_ref, gospel_text
async function importLecturas(rows) {
  var BATCH = 200, total = 0, errors = []
  var seen = {}, deduped = []
  var valid = rows.filter(function(r) { return r.cycle && r.season && r.lang })
  for (var i = 0; i < valid.length; i++) {
    var r = valid[i]
    var key = [r.cycle, r.season, toNumOrDefault(r.week,0), toNumOrDefault(r.weekday,0), clean(r.feast_key)||'', r.lang].join('|')
    if (seen[key]) continue
    seen[key] = true
    deduped.push({
      cycle: r.cycle, season: r.season,
      week: toNumOrDefault(r.week, 0), weekday: toNumOrDefault(r.weekday, 0),
      feast_key: clean(r.feast_key) || '', lang: r.lang,
      title: clean(r.title), liturgical_color: clean(r.liturgical_color),
      first_reading_ref: clean(r.first_reading_ref), first_reading_text: clean(r.first_reading_text),
      psalm_ref: clean(r.psalm_ref), psalm_text: clean(r.psalm_text),
      second_reading_ref: clean(r.second_reading_ref), second_reading_text: clean(r.second_reading_text),
      gospel_ref: clean(r.gospel_ref), gospel_text: clean(r.gospel_text),
      updated_at: new Date().toISOString()
    })
  }
  if (deduped.length === 0) return { count: 0, error: 'No hay filas validas' }
  for (var i = 0; i < deduped.length; i += BATCH) {
    var batch = deduped.slice(i, i + BATCH)
    var { error } = await supabaseAdmin.from('lectionary').upsert(batch, { onConflict: 'cycle,season,week,weekday,feast_key,lang' })
    if (error) errors.push('batch ' + i + ': ' + error.message)
    else total += batch.length
  }
  return { count: total, error: errors.length > 0 ? errors.join('; ') : null }
}

// reflexiones → lectionary_reflections (upsert on cycle,season,week,feast_key,lang)
// Excel cols: cycle, season, week, weekday, feast_key, lang, title, liturgical_color,
//             gospel_ref, gospel_text, reflexion, silence, meditative_phrase, inner_question,
//             brief_prayer, spiritual_school, theme, tags
async function importReflexiones(rows) {
  var BATCH = 200, total = 0, errors = []
  var seen = {}, deduped = []
  var valid = rows.filter(function(r) { return r.lang })
  for (var i = 0; i < valid.length; i++) {
    var r = valid[i]
    var key = [(clean(r.cycle)||''), (clean(r.season)||''), toNumOrDefault(r.week,0), (clean(r.feast_key)||''), r.lang].join('|')
    if (seen[key]) continue
    seen[key] = true
    deduped.push({
      cycle: clean(r.cycle) || '', season: clean(r.season) || '',
      week: toNumOrDefault(r.week, 0), feast_key: clean(r.feast_key) || '',
      lang: r.lang, title: clean(r.title), liturgical_color: clean(r.liturgical_color),
      gospel_ref: clean(r.gospel_ref), gospel_text: clean(r.gospel_text),
      reflexion: clean(r.reflexion),
      silence: clean(r.silence), meditative_phrase: clean(r.meditative_phrase),
      inner_question: clean(r.inner_question), brief_prayer: clean(r.brief_prayer),
      spiritual_school: clean(r.spiritual_school) || 'bernardina',
      theme: clean(r.theme),
      tags: r.tags ? r.tags.split(',').map(function(t) { return t.trim() }) : [],
      updated_at: new Date().toISOString()
    })
  }
  if (deduped.length === 0) return { count: 0, error: 'No hay filas validas' }
  for (var i = 0; i < deduped.length; i += BATCH) {
    var batch = deduped.slice(i, i + BATCH)
    var { error } = await supabaseAdmin.from('lectionary_reflections').upsert(batch, { onConflict: 'cycle,season,week,feast_key,lang' })
    if (error) errors.push('batch ' + i + ': ' + error.message)
    else total += batch.length
  }
  return { count: total, error: errors.length > 0 ? errors.join('; ') : null }
}

// laudes/visperas → liturgy_hours (upsert on hour_type,psalter_week,weekday,season_variant,lang)
// Excel cols: psalter_week, week, weekday, season_variant, lang, feast_key, title,
//             psalm1_ref, psalm1_text, psalm1_antiphon, psalm2_ref, psalm2_text, psalm2_antiphon,
//             psalm3_ref, psalm3_text, psalm3_antiphon, short_reading_ref, short_reading_text,
//             canticle_ref, canticle_text, canticle_antiphon, hymn_text,
//             responsory_v, responsory_r, intercessions, closing_prayer
// NOTE: feast_key NOT included in insert; columns packed into JSONB content
async function importLiturgia(rows, hourType) {
  var validRows = rows.filter(function(r) {
    return r.weekday !== '' && r.weekday !== undefined && !isNaN(parseInt(r.weekday))
  })
  if (validRows.length === 0) return { count: 0, error: 'No hay filas con weekday valido' }
  var seen = {}, deduped = []
  for (var i = 0; i < validRows.length; i++) {
    var r = validRows[i]
    var pw = toIntOrNull(r.psalter_week) || 1
    var wd = parseInt(r.weekday)
    var sv = clean(r.season_variant) || 'ordinary'
    var ln = clean(r.lang) || 'es'
    var key = hourType + '|' + pw + '|' + wd + '|' + sv + '|' + ln
    if (seen[key]) continue
    seen[key] = true
    var content = {
      title: clean(r.title),
      psalm1: { ref: clean(r.psalm1_ref), text: clean(r.psalm1_text), antiphon: clean(r.psalm1_antiphon) },
      psalm2: { ref: clean(r.psalm2_ref), text: clean(r.psalm2_text), antiphon: clean(r.psalm2_antiphon) },
      psalm3: { ref: clean(r.psalm3_ref), text: clean(r.psalm3_text), antiphon: clean(r.psalm3_antiphon) },
      short_reading: { ref: clean(r.short_reading_ref), text: clean(r.short_reading_text) },
      canticle: { ref: clean(r.canticle_ref), text: clean(r.canticle_text), antiphon: clean(r.canticle_antiphon) },
      hymn_text: clean(r.hymn_text),
      responsory: { v: clean(r.responsory_v), r: clean(r.responsory_r) },
      intercessions: clean(r.intercessions),
      closing_prayer: clean(r.closing_prayer)
    }
    deduped.push({ hour_type: hourType, psalter_week: pw, weekday: wd, season_variant: sv, lang: ln, content: content })
  }
  var BATCH = 50, total = 0, errors = []
  for (var i = 0; i < deduped.length; i += BATCH) {
    var batch = deduped.slice(i, i + BATCH)
    var { error } = await supabaseAdmin.from('liturgy_hours').upsert(batch, { onConflict: 'hour_type,psalter_week,weekday,season_variant,lang' })
    if (error) errors.push('batch ' + i + ': ' + error.message)
    else total += batch.length
  }
  return { count: total, error: errors.length > 0 ? errors.join('; ') : null }
}

// journals → journal_content (upsert on journal_slug,day_number,week_number,lang,question_number)
// Excel cols: journal_slug, day_number, week_number, lang, title, content
// question_number is auto-assigned sequentially within each (slug,day,week,lang) group if not in Excel
async function importJournals(rows) {
  var groupCount = {}
  var mapped = rows.filter(function(r) { return r.journal_slug }).map(function(r) {
    var key = [r.journal_slug.trim(), r.day_number || '', r.week_number || '', (clean(r.lang) || 'es')].join('|')
    groupCount[key] = (groupCount[key] || 0) + 1
    return {
      journal_slug: r.journal_slug.trim(),
      day_number: toIntOrNull(r.day_number),
      week_number: toIntOrNull(r.week_number),
      lang: clean(r.lang) || 'es',
      section_type: clean(r.section_type) || 'question',
      question_number: toIntOrNull(r.question_number) || groupCount[key],
      title: clean(r.title),
      content: clean(r.content)
    }
  })
  if (mapped.length === 0) return { count: 0, error: 'No hay filas validas' }
  var BATCH = 200, total = 0, errors = []
  for (var i = 0; i < mapped.length; i += BATCH) {
    var batch = mapped.slice(i, i + BATCH)
    var { error } = await supabaseAdmin.from('journal_content').upsert(batch, { onConflict: 'journal_slug,day_number,week_number,lang,question_number' })
    if (error) errors.push('batch ' + i + ': ' + error.message)
    else total += batch.length
  }
  return { count: total, error: errors.length > 0 ? errors.join('; ') : null }
}

// journal_metadata → journal_metadata (upsert on journal_slug,lang)
// Excel cols: journal_slug, lang, description, opening_prayer, closing_prayer
async function importJournalMetadata(rows) {
  var mapped = rows.filter(function(r) { return r.journal_slug && r.lang }).map(function(r) {
    return {
      journal_slug: r.journal_slug.trim(),
      lang: clean(r.lang) || 'es',
      description: clean(r.description),
      opening_prayer: clean(r.opening_prayer),
      closing_prayer: clean(r.closing_prayer)
    }
  })
  if (mapped.length === 0) return { count: 0, error: 'No hay filas validas' }
  var { error } = await supabaseAdmin.from('journal_metadata').upsert(mapped, { onConflict: 'journal_slug,lang' })
  if (error) return { count: 0, error: error.message }
  return { count: mapped.length, error: null }
}

// buenas_noches → bedtime_stories (upsert on liturgical_period,cycle,story_number,lang)
// Excel cols: liturgical_period, cycle, story_number, lang, title, content, gospel_reference, volume_slug
async function importBuenasNoches(rows) {
  var mapped = rows.filter(function(r) {
    return r.liturgical_period && r.story_number && !isNaN(parseInt(r.story_number))
  }).map(function(r) {
    return {
      liturgical_period: r.liturgical_period,
      cycle: clean(r.cycle) || 'A',
      story_number: parseInt(r.story_number),
      lang: clean(r.lang) || 'es',
      title: clean(r.title),
      content: clean(r.content),
      gospel_reference: clean(r.gospel_reference),
      volume_slug: clean(r.volume_slug)
    }
  })
  if (mapped.length === 0) return { count: 0, error: 'No hay filas validas' }
  var { error } = await supabaseAdmin.from('bedtime_stories').upsert(mapped, { onConflict: 'liturgical_period,cycle,story_number,lang' })
  return { count: mapped.length, error: error ? error.message : null }
}

export async function POST(request) {
  try {
    var authHeader = request.headers.get('authorization')
    if (!authHeader) return Response.json({ error: 'No autorizado' }, { status: 401 })
    var token = authHeader.replace('Bearer ', '')
    var { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user || !ADMIN_EMAILS.includes(user.email)) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }
    var body = await request.json()
    var { sheetId, tabName } = body
    if (!sheetId || !tabName) return Response.json({ error: 'Faltan sheetId o tabName' }, { status: 400 })
    var url = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(tabName) + '&headers=1'
    var csvRes = await fetch(url)
    if (!csvRes.ok) return Response.json({ error: 'No se pudo leer el Sheet. Verifica que este publicado.' }, { status: 400 })
    var csvText = await csvRes.text()
    var rows = parseCSV(csvText)
    if (rows.length === 0) return Response.json({ error: 'El sheet esta vacio o no tiene datos' }, { status: 400 })
    var result
    if (tabName === 'santos') result = await importSantos(rows)
    else if (tabName === 'lecturas') result = await importLecturas(rows)
    else if (tabName === 'reflexiones') result = await importReflexiones(rows)
    else if (tabName === 'laudes') result = await importLiturgia(rows, 'lauds')
    else if (tabName === 'visperas') result = await importLiturgia(rows, 'vespers')
    else if (tabName === 'journals') result = await importJournals(rows)
    else if (tabName === 'journal_metadata') result = await importJournalMetadata(rows)
    else if (tabName === 'buenas_noches') result = await importBuenasNoches(rows)
    else return Response.json({ error: 'Tab no reconocido: ' + tabName }, { status: 400 })
    return Response.json({ success: true, count: result.count, error: result.error })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
