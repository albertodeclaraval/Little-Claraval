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
  var slug = url.searchParams.get('slug')
  var lang = url.searchParams.get('lang') || 'es'

  if (!slug) return NextResponse.json({ error: 'Parametro slug requerido' }, { status: 400 })

  var sb = adminClient()
  var { data, error } = await sb.from('journal_metadata').select('*').eq('journal_slug', slug).eq('lang', lang).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data || null })
}

export async function POST(request) {
  var user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  try {
    var body = await request.json()
    var { journal_slug, lang, description, opening_prayer, closing_prayer } = body

    if (!journal_slug || !lang) return NextResponse.json({ error: 'journal_slug y lang son requeridos' }, { status: 400 })

    var sb = adminClient()
    var { error } = await sb.from('journal_metadata').upsert(
      { journal_slug, lang, description: description || null, opening_prayer: opening_prayer || null, closing_prayer: closing_prayer || null, updated_at: new Date().toISOString() },
      { onConflict: 'journal_slug,lang' }
    )

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
