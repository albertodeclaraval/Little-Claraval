'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

var supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
var ADMIN_EMAILS = ['betoyac@gmail.com', 'albertodeclaraval@gmail.com']
var colors = { pergamino: '#F8F1E6', vino: '#782F40', oro: '#B4903E', texto: '#2C1810', verde: '#4B643C' }

var SLUGS = ['examen', 'paz', 'fortaleza', 'fiat', 'verbum', 'magnificat', 'confiteor', 'lumen', 'miles']
var LANGS = ['es', 'en']

export default function AdminJournalsPage() {
  var [user, setUser] = useState(null)
  var [authorized, setAuthorized] = useState(false)
  var [token, setToken] = useState(null)
  var [slug, setSlug] = useState('examen')
  var [lang, setLang] = useState('es')
  var [description, setDescription] = useState('')
  var [openingPrayer, setOpeningPrayer] = useState('')
  var [closingPrayer, setClosingPrayer] = useState('')
  var [msg, setMsg] = useState('')
  var [loadingData, setLoadingData] = useState(false)
  var [saving, setSaving] = useState(false)

  useEffect(function() {
    supabase.auth.getSession().then(function(res) {
      if (res.data.session) {
        setUser(res.data.session.user)
        setToken(res.data.session.access_token)
        if (ADMIN_EMAILS.includes(res.data.session.user.email)) setAuthorized(true)
      }
    })
  }, [])

  useEffect(function() {
    if (!authorized || !token) return
    loadMetadata()
  }, [slug, lang, authorized, token])

  function loadMetadata() {
    setLoadingData(true)
    setMsg('')
    fetch('/api/admin/journals?slug=' + slug + '&lang=' + lang, {
      headers: { Authorization: 'Bearer ' + token }
    }).then(function(r) { return r.json() }).then(function(res) {
      if (res.data) {
        setDescription(res.data.description || '')
        setOpeningPrayer(res.data.opening_prayer || '')
        setClosingPrayer(res.data.closing_prayer || '')
      } else {
        setDescription('')
        setOpeningPrayer('')
        setClosingPrayer('')
      }
      setLoadingData(false)
    }).catch(function() { setLoadingData(false) })
  }

  async function handleSave() {
    setSaving(true); setMsg('')
    try {
      var r = await fetch('/api/admin/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ journal_slug: slug, lang, description, opening_prayer: openingPrayer, closing_prayer: closingPrayer })
      })
      var d = await r.json()
      if (d.success) setMsg('Guardado correctamente')
      else setMsg('Error: ' + d.error)
    } catch (e) { setMsg('Error de conexion') }
    setSaving(false)
  }

  if (!authorized) {
    return (
      <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
        <p style={{ color: colors.texto }}>Acceso no autorizado.</p>
      </div>
    )
  }

  var taStyle = { width: '100%', border: '1px solid #ddd', borderRadius: '6px', padding: '0.75rem', fontSize: '0.9rem', lineHeight: 1.7, resize: 'vertical', fontFamily: 'Georgia, serif', boxSizing: 'border-box', color: colors.texto }

  return (
    <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', fontFamily: 'Georgia, serif', color: colors.texto, padding: '2rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <a href="/admin" style={{ color: colors.vino, fontSize: '0.9rem', textDecoration: 'none' }}>← Admin</a>
        <h1 style={{ color: colors.vino, margin: '1rem 0 1.5rem' }}>Metadatos de Journals</h1>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Journal</label>
              <select value={slug} onChange={function(e) { setSlug(e.target.value) }} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', color: colors.texto, fontFamily: 'Georgia, serif' }}>
                {SLUGS.map(function(s) { return <option key={s} value={s}>{s}</option> })}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Idioma</label>
              <select value={lang} onChange={function(e) { setLang(e.target.value) }} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', color: colors.texto, fontFamily: 'Georgia, serif' }}>
                {LANGS.map(function(l) { return <option key={l} value={l}>{l}</option> })}
              </select>
            </div>
          </div>

          {loadingData ? (
            <p style={{ color: '#aaa', fontStyle: 'italic' }}>Cargando...</p>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Descripción del journal</label>
                <textarea
                  value={description}
                  onChange={function(e) { setDescription(e.target.value) }}
                  placeholder="Descripción que aparece al entrar al journal..."
                  rows={4}
                  style={taStyle}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Oración de apertura</label>
                <p style={{ fontSize: '0.72rem', color: '#aaa', margin: '0 0 0.35rem', fontStyle: 'italic' }}>Se muestra antes del textarea, precedida por ✠</p>
                <textarea
                  value={openingPrayer}
                  onChange={function(e) { setOpeningPrayer(e.target.value) }}
                  placeholder="Oración al inicio de cada día..."
                  rows={3}
                  style={taStyle}
                />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Oración de cierre</label>
                <p style={{ fontSize: '0.72rem', color: '#aaa', margin: '0 0 0.35rem', fontStyle: 'italic' }}>Se muestra después del botón Guardar, precedida por ✠</p>
                <textarea
                  value={closingPrayer}
                  onChange={function(e) { setClosingPrayer(e.target.value) }}
                  placeholder="Oración al final de cada día..."
                  rows={3}
                  style={taStyle}
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ backgroundColor: colors.vino, color: 'white', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', cursor: saving ? 'default' : 'pointer', width: '100%', fontSize: '0.9rem', fontFamily: 'Georgia, serif' }}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              {msg && (
                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', fontWeight: 'bold', color: msg.includes('Error') ? '#991b1b' : colors.verde }}>
                  {msg}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
