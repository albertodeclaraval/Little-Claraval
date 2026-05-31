'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

var supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
var ADMIN_EMAILS = ['betoyac@gmail.com', 'albertodeclaraval@gmail.com']
var colors = { pergamino: '#F8F1E6', vino: '#782F40', oro: '#B4903E', texto: '#2C1810', verde: '#4B643C' }

var TABS = [
  {
    name: 'santos',
    label: 'Santos del día',
    icon: '⛪',
    table: 'saints',
    conflict: 'month_day',
    rows: '367',
    desc: 'month_day · name_es · name_en · bio_es · bio_en · patronage_es · patronage_en · birth_year · death_year · canonization_year · canonized_by · feast_day_es · feast_day_en · prayer_es · prayer_en · rank · tags'
  },
  {
    name: 'lecturas',
    label: 'Lecturas',
    icon: '📖',
    table: 'lectionary',
    conflict: 'cycle, season, week, weekday, feast_key, lang',
    rows: '1,424',
    desc: 'cycle · season · week · weekday · feast_key · lang · title · liturgical_color · first_reading_ref · first_reading_text · psalm_ref · psalm_text · second_reading_ref · second_reading_text · gospel_ref · gospel_text'
  },
  {
    name: 'reflexiones',
    label: 'Reflexiones',
    icon: '✝️',
    table: 'lectionary_reflections',
    conflict: 'cycle, season, week, feast_key, lang',
    rows: '174',
    desc: 'cycle · season · week · feast_key · lang · title · liturgical_color · gospel_ref · gospel_text · silence · meditative_phrase · inner_question · brief_prayer · spiritual_school · theme · tags'
  },
  {
    name: 'laudes',
    label: 'Laudes',
    icon: '🌅',
    table: 'liturgy_hours (hour_type=lauds)',
    conflict: 'hour_type, psalter_week, weekday, season_variant, lang',
    rows: '802',
    desc: 'psalter_week · weekday · season_variant · lang · title → content JSONB {psalm1,psalm2,psalm3,short_reading,canticle,hymn_text,responsory,intercessions,closing_prayer}'
  },
  {
    name: 'visperas',
    label: 'Vísperas',
    icon: '🌇',
    table: 'liturgy_hours (hour_type=vespers)',
    conflict: 'hour_type, psalter_week, weekday, season_variant, lang',
    rows: '1,572',
    desc: 'psalter_week · weekday · season_variant · lang · title → content JSONB {psalm1,psalm2,psalm3,short_reading,canticle,hymn_text,responsory,intercessions,closing_prayer}'
  },
  {
    name: 'journals',
    label: 'Journals',
    icon: '📓',
    table: 'journal_content',
    conflict: 'journal_slug, day_number, week_number, lang, question_number',
    rows: '5,315',
    desc: 'journal_slug · day_number · week_number · lang · title · content (question_number auto-asignado)'
  },
  {
    name: 'buenas_noches',
    label: 'Buenas Noches Jesús',
    icon: '🌙',
    table: 'bedtime_stories',
    conflict: 'liturgical_period, cycle, story_number, lang',
    rows: '6',
    desc: 'liturgical_period · cycle · story_number · lang · title · content · gospel_reference · volume_slug'
  }
]

export default function ImportarPage() {
  var [authorized, setAuthorized] = useState(false)
  var [sheetId, setSheetId] = useState('')
  var [importing, setImporting] = useState(null)
  var [results, setResults] = useState({})

  useEffect(function() {
    var saved = localStorage.getItem('lc_sheet_id')
    if (saved) setSheetId(saved)
    supabase.auth.getSession().then(function(res) {
      if (res.data.session && ADMIN_EMAILS.includes(res.data.session.user.email)) setAuthorized(true)
    })
  }, [])

  function saveSheetId(val) { setSheetId(val); localStorage.setItem('lc_sheet_id', val) }

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

  async function handleImportAll() {
    if (!sheetId.trim()) { alert('Ingresa el ID del Google Sheet'); return }
    for (var i = 0; i < TABS.length; i++) { await handleImport(TABS[i].name) }
  }

  if (!authorized) {
    return (
      <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
        <p style={{ color: colors.texto }}>Acceso no autorizado.</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', fontFamily: 'Georgia, serif', color: colors.texto, padding: '2rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ color: colors.vino, marginBottom: '0.25rem' }}>Importar Contenido</h1>
            <p style={{ fontSize: '0.85rem', color: '#888' }}>Desde Google Sheets. Cada pestaña = nombre exacto del sheet.</p>
          </div>
          <a href="/admin" style={{ fontSize: '0.8rem', color: colors.vino, textDecoration: 'none' }}>← Admin</a>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>Google Sheet ID</label>
          <input
            type="text"
            value={sheetId}
            onChange={function(e) { saveSheetId(e.target.value) }}
            placeholder="Ej: 1aBcDeFgHiJkLmNoPqRsTuVwXyZ..."
            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box', color: colors.texto, fontFamily: 'monospace' }}
          />
        </div>

        <button
          onClick={handleImportAll}
          disabled={importing !== null || !sheetId.trim()}
          style={{ width: '100%', backgroundColor: importing ? '#ccc' : colors.verde, color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem', cursor: importing ? 'default' : 'pointer', fontSize: '0.9rem', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}
        >
          {importing ? 'Importando...' : '⟳ Importar TODO'}
        </button>

        {TABS.map(function(tab) {
          var r = results[tab.name]
          return (
            <div key={tab.name} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: colors.vino }}>{tab.icon} {tab.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#999', marginTop: '0.15rem' }}>
                    <b>{tab.name}</b> → <span style={{ color: colors.vino }}>{tab.table}</span> · ~{tab.rows} filas
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#888', marginTop: '0.1rem' }}>
                    conflict: <span style={{ fontFamily: 'monospace' }}>{tab.conflict}</span>
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#bbb', marginTop: '0.1rem', wordBreak: 'break-word' }}>{tab.desc}</div>
                </div>
                <button
                  onClick={function() { handleImport(tab.name) }}
                  disabled={importing !== null}
                  style={{ backgroundColor: importing === tab.name ? '#ccc' : colors.vino, color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: importing !== null ? 'default' : 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap', marginLeft: '0.75rem', flexShrink: 0 }}
                >
                  {importing === tab.name ? 'Importando...' : 'Importar'}
                </button>
              </div>
              {r && (
                <div style={{ marginTop: '0.6rem', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: r.error && !r.success ? '#fee2e2' : '#dcfce7', color: r.error && !r.success ? '#991b1b' : '#166534' }}>
                  {r.success
                    ? '✓ ' + r.count + ' filas importadas' + (r.error ? ' (advertencia: ' + r.error + ')' : '')
                    : '✗ Error: ' + r.error}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
