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
      row[headers[j]] = values[j] !== undefined ? values[j].trim() : ''
    }
    rows.push(row)
  }
  return rows
}

function toIntOrNull(v) { var n = parseInt(v); return isNaN(n) ? null : n }

async function importSantos(rows) {
  var mapped = rows.filter(function(r) { return r.month_day }).map(function(r) {
    return {
      month_day: r.month_day,
      name_es: r.name_es || null, name_en: r.name_en || null,
      bio_es: r.bio_es || null, bio_en: r.bio_en || null,
      patronage_es: r.patronage_es || null, patronage_en: r.patronage_en || null,
      birth_year: toIntOrNull(r.birth_year), death_year: toIntOrNull(r.death_year),
      canonization_year: toIntOrNull(r.canonization_year), canonized_by: r.canonized_by || null,
      feast_day_es: r.feast_day_es || null, feast_day_en: r.feast_day_en || null,
      prayer_es: r.prayer_es || null, prayer_en: r.prayer_en || null,
      rank: r.rank || 'memorial',
      tags: r.tags ? r.tags.split(',').map(function(t) { return t.trim() }) : []
    }
  })
  var { data, error } = await supabaseAdmin.from('saints').upsert(mapped, { onConflict: 'month_day' })
  return { count: mapped.length, error: error ? error.message : null }
}

async function importLecturas(rows) {
  var count = 0, errors = []
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i]
    if (!r.date) continue
    var { data: ld, error: ldErr } = await supabaseAdmin.from('liturgical_days').upsert({
      date: r.date, season: r.season || null, liturgical_color: r.liturgical_color || null,
      title_es: r.title_es || null, celebration: r.celebration || null
    }, { onConflict: 'date' }).select().single()
    if (ldErr) { errors.push('liturgical_days ' + r.date + ': ' + ldErr.message); continue }
    var { error: rdErr } = await supabaseAdmin.from('readings').upsert({
      date: r.date, liturgical_day_id: ld.id,
      first_reading_ref: r.first_reading_ref || null, first_reading_ref_es: r.first_reading_ref_es || null,
      first_reading_text_es: r.first_reading_text_es || null, first_reading_text_en: r.first_reading_text_en || null,
      psalm_ref: r.psalm_ref || null, psalm_ref_es: r.psalm_ref_es || null,
      psalm_text_es: r.psalm_text_es || null, psalm_text_en: r.psalm_text_en || null,
      second_reading_ref: r.second_reading_ref || null, second_reading_ref_es: r.second_reading_ref_es || null,
      second_reading_text_es: r.second_reading_text_es || null, second_reading_text_en: r.second_reading_text_en || null,
      gospel_ref: r.gospel_ref || null, gospel_ref_es: r.gospel_ref_es || null,
      gospel_text_es: r.gospel_text_es || null, gospel_text_en: r.gospel_text_en || null
    }, { onConflict: 'date' })
    if (rdErr) { errors.push('readings ' + r.date + ': ' + rdErr.message) }
    else { count++ }
  }
  return { count: count, error: errors.length > 0 ? errors.join('; ') : null }
}

async function importReflexiones(rows) {
  var mapped = rows.filter(function(r) { return r.date && r.lang }).map(function(r) {
    return {
      date: r.date, lang: r.lang, gospel_reference: r.gospel_reference || null,
      content: {
        silence: r.silence || '', meditative_phrase: r.meditative_phrase || '',
        inner_question: r.inner_question || '', brief_prayer: r.brief_prayer || ''
      },
      spiritual_school: r.spiritual_school || 'bernardina',
      theme: r.theme || null,
      tags: r.tags ? r.tags.split(',').map(function(t) { return t.trim() }) : [],
      status: 'published', published_at: new Date().toISOString()
    }
  })
  var { error } = await supabaseAdmin.from('reflections').upsert(mapped, { onConflict: 'date,lang' })
  return { count: mapped.length, error: error ? error.message : null }
}

async function importLiturgia(rows, hourType) {
  var mapped = rows.filter(function(r) { return r.content_json }).map(function(r) {
    var content
    try { content = JSON.parse(r.content_json) } catch(e) { return null }
    return {
      hour_type: hourType,
      psalter_week: toIntOrNull(r.psalter_week) || 1,
      weekday: toIntOrNull(r.weekday),
      season_variant: r.season_variant || 'ordinary',
      lang: r.lang || 'es',
      content: content
    }
  }).filter(function(r) { return r !== null })
  var { error } = await supabaseAdmin.from('liturgy_hours').upsert(mapped, { onConflict: 'hour_type,psalter_week,weekday,season_variant,lang' })
  return { count: mapped.length, error: error ? error.message : null }
}

async function importJournals(rows) {
  var mapped = rows.filter(function(r) { return r.journal_slug && r.day_number }).map(function(r) {
    return {
      journal_slug: r.journal_slug, day_number: parseInt(r.day_number),
      lang: r.lang || 'es', title: r.title || null, content: r.content || null
    }
  })
  var { error } = await supabaseAdmin.from('journal_content').upsert(mapped, { onConflict: 'journal_slug,day_number,lang' })
  return { count: mapped.length, error: error ? error.message : null }
}

async function importBuenasNoches(rows) {
  var mapped = rows.filter(function(r) { return r.liturgical_period && r.story_number }).map(function(r) {
    return {
      liturgical_period: r.liturgical_period, cycle: r.cycle || 'A',
      story_number: parseInt(r.story_number), lang: r.lang || 'es',
      title: r.title || null, content: r.content || null,
      gospel_reference: r.gospel_reference || null, volume_slug: r.volume_slug || null
    }
  })
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
    var url = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(tabName)
    var csvRes = await fetch(url)
    if (!csvRes.ok) return Response.json({ error: 'No se pudo leer el Sheet. Verifica que esté publicado.' }, { status: 400 })
    var csvText = await csvRes.text()
    var rows = parseCSV(csvText)
    if (rows.length === 0) return Response.json({ error: 'El sheet está vacío o no tiene datos' }, { status: 400 })
    var result
    if (tabName === 'santos') result = await importSantos(rows)
    else if (tabName === 'lecturas') result = await importLecturas(rows)
    else if (tabName === 'reflexiones') result = await importReflexiones(rows)
    else if (tabName === 'laudes') result = await importLiturgia(rows, 'lauds')
    else if (tabName === 'visperas') result = await importLiturgia(rows, 'vespers')
    else if (tabName === 'journals') result = await importJournals(rows)
    else if (tabName === 'buenas_noches') result = await importBuenasNoches(rows)
    else return Response.json({ error: 'Tab no reconocido: ' + tabName }, { status: 400 })
    return Response.json({ success: true, count: result.count, error: result.error })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
