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

// POST /api/admin/day-preference
// Body: { date: 'YYYY-MM-DD', use_feast: boolean }
export async function POST(request) {
  var user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  try {
    var body = await request.json()
    var date = body.date
    var useFeast = !!body.use_feast

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'date requerido en formato YYYY-MM-DD' }, { status: 400 })
    }

    var sb = adminClient()
    var res = await sb
      .from('reflection_day_preference')
      .upsert({ date: date, use_feast: useFeast }, { onConflict: 'date' })

    if (res.error) return NextResponse.json({ error: res.error.message }, { status: 500 })
    return NextResponse.json({ success: true, date: date, use_feast: useFeast })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
