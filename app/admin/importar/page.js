'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

var supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
var ADMIN_EMAILS = ['betoyac@gmail.com', 'albertodeclaraval@gmail.com']
var colors = { pergamino: '#F8F1E6', vino: '#782F40', oro: '#B4903E', texto: '#2C1810', verde: '#4B643C', azul: '#2B4C7E' }

var TABS = [
  { name: 'santos', label: 'Santos del día', desc: 'month_day, name_es, bio_es, patronage_es...', icon: '⛪' },
  { name: 'lecturas', label: 'Lecturas', desc: 'date, season, first_reading_ref, gospel_text_es...', icon: '📖' },
  { name: 'reflexiones', label: 'Reflexiones', desc: 'date, lang, silence, meditative_phrase...', icon: '✝️' },
  { name: 'laudes', label: 'Laudes', desc: 'psalter_week, weekday, lang, content_json', icon: '🌅' },
  { name: 'visperas', label: 'Vísperas', desc: 'psalter_week, weekday, lang, content_json', icon: '🌇' },
  { name: 'journals', label: 'Journals', desc: 'journal_slug, day_number, lang, title, content', icon: '📓' },
  { name: 'buenas_noches', label: 'Buenas Noches Jesús', desc: 'liturgical_period, cycle, story_number, lang...', icon: '🌙' }
]

export default function ImportarPage() {
  var [user, setUser] = useState(null)
  var [authorized, setAuthorized] = useState(false)
  var [sheetId, setSheetId] = useState('')
  var [importing, setImporting] = useState(null)
  var [results, setResults] = useState({})

  useEffect(function() {
    var saved = localStorage.getItem('lc_sheet_id')
    if (saved) setSheetId(saved)
    supabase.auth.getSession().then(function(res) {
      if (res.data.session) {
        setUser(res.data.session.user)
        if (ADMIN_EMAILS.includes(res.data.session.user.email)) setAuthorized(true)
      }
    })
  }, [])

  function saveSheetId(val) {
    setSheetId(val)
    localStorage.setItem('lc_sheet_id', val)
  }

  async function handleImport(tabName) {
    if (!sheetId.trim()) { alert('Ingresa el ID del Google Sheet'); return }
    setImporting(tabName)
    setResults(function(prev) { return Object.assign({}, prev, { [tabName]: null }) })
    try {
      var session = await supabase.auth.getSession()
      var token = session.data.session.access_token
      var res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ sheetId: sheetId.trim(), tabName: tabName })
      })
      var data = await res.json()
      setResults(function(prev) { return Object.assign({}, prev, { [tabName]: data }) })
    } catch(e) {
      setResults(function(prev) { return Object.assign({}, prev, { [tabName]: { error: e.message } }) })
    }
    setImporting(null)
  }

  if (!authorized) {
    return (<div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}><p style={{ color: colors.texto }}>Acceso no autorizado.</p></div>)
  }

  return (
    <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', fontFamily: 'Georgia, serif', color: colors.texto, padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: colors.vino, marginBottom: '0.5rem' }}>Importar Contenido</h1>
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.5rem' }}>Importa desde Google Sheets. Cada pestaña del Sheet debe coincidir con el nombre exacto.</p>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Google Sheet ID</label>
          <input type="text" value={sheetId} onChange={function(e) { saveSheetId(e.target.value) }} placeholder="Ej: 1aBcDeFgHiJkLmNoPqRsTuVwXyZ..." style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box', color: colors.texto, fontFamily: 'monospace' }} />
          <p style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '0.3rem' }}>El ID está en la URL del Sheet: docs.google.com/spreadsheets/d/<b>ESTE_ID</b>/edit</p>
        </div>
        {TABS.map(function(tab) {
          var r = results[tab.name]
          return (
            <div key={tab.name} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: colors.vino }}>{tab.icon} {tab.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '0.15rem' }}>Pestaña: <b>{tab.name}</b> — {tab.desc}</div>
                </div>
                <button onClick={function() { handleImport(tab.name) }} disabled={importing !== null} style={{ backgroundColor: importing === tab.name ? '#ccc' : colors.vino, color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: importing !== null ? 'default' : 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {importing === tab.name ? 'Importando...' : 'Importar'}
                </button>
              </div>
              {r && (
                <div style={{ marginTop: '0.6rem', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: r.error ? '#fee2e2' : '#dcfce7', color: r.error ? '#991b1b' : '#166534' }}>
                  {r.success ? r.count + ' filas importadas' + (r.error ? ' (con errores: ' + r.error + ')' : '') : 'Error: ' + r.error}
                </div>
              )}
            </div>
          )
        })}
        <a href="/admin" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: colors.vino }}>← Volver al admin</a>
      </div>
    </div>
  )
}
