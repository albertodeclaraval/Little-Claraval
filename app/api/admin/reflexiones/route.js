import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

var ADMIN_EMAILS = ['betoyac@gmail.com', 'albertodeclaraval@gmail.com']

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function verifyAdmin(request) {
  var authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  var token = authHeader.replace('Bearer ', '')
  var sb = adminClient()
  var { data, error } = await sb.auth.getUser(token)
  if (error || !data.user) return null
  if (!ADMIN_EMAILS.includes(data.user.email)) return null
  return data.user
}

// weekday se filtra SOLO en la rama ferial: el contenido ferial es por día.
// Las filas de feast pueden ser weekday-agnósticas (la Asunción cae en día
// distinto cada año), así que ahí no se toca — mismo comportamiento de siempre.
async function findReflection(sb, lang, season, cycle, feastKey, week, weekday) {
  var q = sb.from('lectionary_reflections').select('*').eq('lang', lang).eq('season', season).eq('cycle', cycle)
  if (feastKey) {
    q = q.eq('feast_key', feastKey)
  } else {
    q = q.eq('feast_key', '')
    if (week !== null && week !== undefined) q = q.eq('week', week)
    if (weekday !== null && weekday !== undefined) q = q.eq('weekday', weekday)
  }
  var { data, error } = await q.maybeSingle()
  if (error) {
    console.error('[findReflection]', { lang: lang, season: season, cycle: cycle, feastKey: feastKey, week: week, weekday: weekday, error: error.message })
  }
  return data || null
}

// GET /api/admin/reflexiones?season=ordinary&cycle=II&feast_key=&week=15&weekday=5
export async function GET(request) {
  var user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  var url = new URL(request.url)
  var season = url.searchParams.get('season')
  var cycle = url.searchParams.get('cycle')
  var feastKey = url.searchParams.get('feast_key') || ''
  var weekRaw = url.searchParams.get('week')
  var week = weekRaw !== null && weekRaw !== '' ? parseInt(weekRaw) : null
  var weekdayRaw = url.searchParams.get('weekday')
  var weekday = weekdayRaw !== null && weekdayRaw !== '' ? parseInt(weekdayRaw) : null

  if (!season || !cycle) return NextResponse.json({ error: 'Parametros requeridos: season, cycle' }, { status: 400 })
  if (!feastKey && weekday === null) return NextResponse.json({ error: 'weekday requerido para reflexiones feriales' }, { status: 400 })

  var sb = adminClient()
  var [es, en] = await Promise.all([
    findReflection(sb, 'es', season, cycle, feastKey, week, weekday),
    findReflection(sb, 'en', season, cycle, feastKey, week, weekday),
  ])

  return NextResponse.json({ es: es || null, en: en || null })
}

// PATCH /api/admin/reflexiones
// Body: { lang, season, cycle, feast_key, week, weekday, reflexion, silence,
//         meditative_phrase, inner_question, brief_prayer, spiritual_school, theme, tags }
export async function PATCH(request) {
  var user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  try {
    var body = await request.json()
    var { lang, season, cycle, feast_key, week } = body

    if (!lang || !season || !cycle) {
      return NextResponse.json({ error: 'Campos requeridos: lang, season, cycle' }, { status: 400 })
    }

    var feastKey = feast_key || ''
    var weekVal = week !== undefined && week !== null ? parseInt(week) : null
    var weekdayVal = body.weekday !== undefined && body.weekday !== null ? parseInt(body.weekday) : null

    if (!feastKey && weekdayVal === null) {
      return NextResponse.json({ error: 'weekday requerido para reflexiones feriales' }, { status: 400 })
    }

    var sb = adminClient()
    var existing = await findReflection(sb, lang, season, cycle, feastKey, weekVal, weekdayVal)

    var record = {
      lang: lang,
      season: season,
      cycle: cycle,
      feast_key: feastKey,
      week: weekVal,
      reflexion: body.reflexion || null,
      silence: body.silence || null,
      meditative_phrase: body.meditative_phrase || null,
      inner_question: body.inner_question || null,
      brief_prayer: body.brief_prayer || null,
      spiritual_school: body.spiritual_school || null,
      theme: body.theme || null,
      tags: body.tags || null,
      updated_at: new Date().toISOString(),
    }
    if (!feastKey) record.weekday = weekdayVal

    var res
    if (existing && existing.id) {
      res = await sb.from('lectionary_reflections').update(record).eq('id', existing.id)
    } else {
      res = await sb.from('lectionary_reflections').insert(record)
    }

    if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
