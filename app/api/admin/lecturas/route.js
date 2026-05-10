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

export async function GET(request) {
  var user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  var url = new URL(request.url)
  var date = url.searchParams.get('date')
  var month = url.searchParams.get('month') // formato: YYYY-MM

  var sb = adminClient()

  if (month) {
    var parts = month.split('-')
    var year = parseInt(parts[0])
    var mo = parseInt(parts[1])
    var startDate = month + '-01'
    var lastDay = new Date(year, mo, 0).getDate()
    var endDate = month + '-' + String(lastDay).padStart(2, '0')
    var { data, error } = await sb.from('readings').select('date').gte('date', startDate).lte('date', endDate)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ dates: (data || []).map(function(r) { return r.date }), total: lastDay })
  }

  if (date) {
    var { data, error } = await sb.from('readings').select('*').eq('date', date).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data: data || null })
  }

  return NextResponse.json({ error: 'Parametro requerido' }, { status: 400 })
}

export async function POST(request) {
  var user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  try {
    var body = await request.json()
    var { date, season, celebration, readings: rd } = body

    if (!date) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

    var sb = adminClient()

    // Upsert liturgical_days
    var ldRes = await sb
      .from('liturgical_days')
      .upsert({ date: date, season: season || '', celebration: celebration || '' }, { onConflict: 'date' })
      .select('id')
      .single()

    if (ldRes.error) {
      return NextResponse.json({ error: 'liturgical_days: ' + ldRes.error.message }, { status: 500 })
    }

    // Upsert readings
    var rdData = {
      date: date,
      liturgical_day_id: ldRes.data.id,
      first_reading_ref: rd.firstReadingRef || null,
      first_reading_ref_es: rd.firstReadingRefEs || null,
      first_reading_text_es: rd.firstReadingTextEs || null,
      first_reading_text_en: rd.firstReadingTextEn || null,
      psalm_ref: rd.psalmRef || null,
      psalm_ref_es: rd.psalmRefEs || null,
      psalm_text_es: rd.psalmTextEs || null,
      psalm_text_en: rd.psalmTextEn || null,
      second_reading_ref: rd.secondReadingRef || null,
      second_reading_ref_es: rd.secondReadingRefEs || null,
      second_reading_text_es: rd.secondReadingTextEs || null,
      second_reading_text_en: rd.secondReadingTextEn || null,
      gospel_ref: rd.gospelRef || null,
      gospel_ref_es: rd.gospelRefEs || null,
      gospel_text_es: rd.gospelTextEs || null,
      gospel_text_en: rd.gospelTextEn || null,
    }

    var rdRes = await sb
      .from('readings')
      .upsert(rdData, { onConflict: 'date' })
      .select('id')
      .single()

    if (rdRes.error) {
      return NextResponse.json({ error: 'readings: ' + rdRes.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
