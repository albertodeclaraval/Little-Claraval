'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getLiturgicalPosition } from '../../lib/content'

var supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
var ADMIN_EMAILS = ['betoyac@gmail.com', 'albertodeclaraval@gmail.com']
var colors = { pergamino: '#F8F1E6', vino: '#782F40', oro: '#B4903E', texto: '#2C1810', verde: '#4B643C', azul: '#3C5078' }

var SCHOOL_OPTIONS = [
  { value: '', label: '— ninguna —' },
  { value: 'bernardina', label: 'Bernardina' },
  { value: 'paulina', label: 'Paulina' },
  { value: 'benedictina', label: 'Benedictina' },
]

var SEASON_ES = {
  ordinary: 'Ordinario', advent: 'Adviento', lent: 'Cuaresma',
  easter: 'Pascua', christmas: 'Navidad',
}

function todayStr() {
  var d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function inputStyle(multiline) {
  return {
    width: '100%', padding: '0.5rem 0.6rem', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '0.88rem', fontFamily: 'Georgia, serif',
    color: colors.texto, boxSizing: 'border-box', resize: multiline ? 'vertical' : 'none',
    lineHeight: 1.6,
    ...(multiline ? { minHeight: '70px' } : {})
  }
}

var labelStyle = { display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem', marginTop: '0.75rem' }
var sectionTitle = { fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0.3rem 0.75rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1rem' }

function LangEditor({ lang, data, onChange, onSave, saving, saved }) {
  var isEs = lang === 'es'
  var accentColor = isEs ? colors.vino : colors.azul
  var labelText = isEs ? 'Español' : 'English'

  function field(key, label, multiline, rows) {
    return (
      <div key={key}>
        <label style={labelStyle}>{label}</label>
        {multiline ? (
          <textarea
            value={data[key] || ''}
            onChange={function(e) { onChange(key, e.target.value) }}
            style={Object.assign({}, inputStyle(true), { minHeight: (rows || 2) * 38 + 'px' })}
          />
        ) : (
          <input
            type="text"
            value={data[key] || ''}
            onChange={function(e) { onChange(key, e.target.value) }}
            style={inputStyle(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '3px solid ' + accentColor }}>
      <span style={Object.assign({}, sectionTitle, { backgroundColor: accentColor, color: 'white' })}>{labelText}</span>

      {field('reflexion', 'Reflexión principal / Main reflection', true, 6)}
      {field('silence', 'Silencio / Silence', true, 2)}
      {field('meditative_phrase', 'Frase meditativa / Meditative phrase', true, 2)}
      {field('inner_question', 'Pregunta interior / Inner question', true, 2)}
      {field('brief_prayer', 'Oración breve / Brief prayer', true, 3)}

      <div>
        <label style={labelStyle}>Escuela espiritual / Spiritual school</label>
        <select
          value={data.spiritual_school || ''}
          onChange={function(e) { onChange('spiritual_school', e.target.value) }}
          style={Object.assign({}, inputStyle(false), { cursor: 'pointer' })}
        >
          {SCHOOL_OPTIONS.map(function(opt) {
            return <option key={opt.value} value={opt.value}>{opt.label}</option>
          })}
        </select>
      </div>

      {field('theme', 'Tema / Theme', false)}
      {field('tags', 'Tags (separados por coma)', false)}

      <button
        onClick={onSave}
        disabled={saving}
        style={{
          marginTop: '1rem', width: '100%', backgroundColor: saved ? colors.verde : accentColor,
          color: 'white', border: 'none', borderRadius: '6px', padding: '0.65rem 1rem',
          cursor: saving ? 'default' : 'pointer', fontSize: '0.88rem', fontFamily: 'Georgia, serif', fontWeight: 'bold',
        }}
      >
        {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar ' + labelText}
      </button>
    </div>
  )
}

export default function ReflexionesAdminPage() {
  var [authorized, setAuthorized] = useState(false)
  var [sessionToken, setSessionToken] = useState(null)
  var [date, setDate] = useState(todayStr())
  var [position, setPosition] = useState(null)
  var [loadingPos, setLoadingPos] = useState(false)
  var [loadingRef, setLoadingRef] = useState(false)
  var [esData, setEsData] = useState({})
  var [enData, setEnData] = useState({})
  var [savingEs, setSavingEs] = useState(false)
  var [savedEs, setSavedEs] = useState(false)
  var [savingEn, setSavingEn] = useState(false)
  var [savedEn, setSavedEn] = useState(false)
  var [posError, setPosError] = useState(null)

  useEffect(function() {
    supabase.auth.getSession().then(function(res) {
      if (res.data.session) {
        var email = res.data.session.user.email
        if (ADMIN_EMAILS.includes(email)) {
          setAuthorized(true)
          setSessionToken(res.data.session.access_token)
        }
      }
    })
  }, [])

  function loadPosition(dateStr) {
    setLoadingPos(true)
    setPosError(null)
    return getLiturgicalPosition(new Date(dateStr + 'T12:00:00')).then(function(pos) {
      setPosition(pos)
      setLoadingPos(false)
      if (!pos) setPosError('No se pudo determinar la posición litúrgica para esta fecha.')
    })
  }

  // Load liturgical position when date changes
  useEffect(function() {
    if (!authorized || !date) return
    loadPosition(date)
  }, [date, authorized])

  // C2: toggle feria/fiesta para memorias opcionales
  async function handleToggleFeast(e) {
    var newVal = e.target.checked
    if (!sessionToken) return
    try {
      var res = await fetch('/api/admin/day-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + sessionToken,
        },
        body: JSON.stringify({ date: date, use_feast: newVal }),
      })
      var d = await res.json()
      if (d.success) {
        await loadPosition(date)
      } else {
        alert('Error al guardar preferencia: ' + (d.error || 'desconocido'))
      }
    } catch (err) {
      alert('Error de conexión')
    }
  }

  // Load reflections when position changes
  useEffect(function() {
    if (!authorized || !position || !sessionToken) return
    setLoadingRef(true)
    setEsData({})
    setEnData({})
    var params = new URLSearchParams({
      season: position.season,
      cycle: position.cycle,
      feast_key: position.feastKey || '',
    })
    if (position.week !== null && position.week !== undefined) params.set('week', position.week)

    fetch('/api/admin/reflexiones?' + params.toString(), {
      headers: { authorization: 'Bearer ' + sessionToken },
    }).then(function(r) { return r.json() }).then(function(d) {
      setEsData(d.es || {})
      setEnData(d.en || {})
      setLoadingRef(false)
    }).catch(function() { setLoadingRef(false) })
  }, [position, sessionToken, authorized])

  function handleChangeEs(key, val) { setEsData(function(prev) { return Object.assign({}, prev, { [key]: val }) }) }
  function handleChangeEn(key, val) { setEnData(function(prev) { return Object.assign({}, prev, { [key]: val }) }) }

  async function handleSave(lang) {
    if (!position || !sessionToken) return
    var setSaving = lang === 'es' ? setSavingEs : setSavingEn
    var setSaved = lang === 'es' ? setSavedEs : setSavedEn
    var data = lang === 'es' ? esData : enData

    setSaving(true)
    setSaved(false)

    var body = Object.assign({}, data, {
      lang,
      season: position.season,
      cycle: position.cycle,
      feast_key: position.feastKey || '',
      week: position.week !== undefined ? position.week : null,
    })

    try {
      var res = await fetch('/api/admin/reflexiones', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + sessionToken,
        },
        body: JSON.stringify(body),
      })
      var d = await res.json()
      if (d.success) {
        setSaved(true)
        setTimeout(function() { setSaved(false) }, 2500)
      } else {
        alert('Error al guardar: ' + (d.error || 'desconocido'))
      }
    } catch(e) {
      alert('Error de conexión')
    }
    setSaving(false)
  }

  if (!authorized) {
    return (
      <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
        <p style={{ color: colors.texto }}>Acceso no autorizado.</p>
      </div>
    )
  }

  var posLabel = position
    ? (SEASON_ES[position.season] || position.season) + ' · Ciclo ' + position.cycle + (position.week ? ' · Sem. ' + position.week : '') + (position.feastKey ? ' · ' + position.feastKey : '')
    : ''

  var gospelRef = (esData && esData.gospel_ref) || (enData && enData.gospel_ref)
  var gospelText = (esData && esData.gospel_text) || (enData && enData.gospel_text)

  return (
    <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', fontFamily: 'Georgia, serif', color: colors.texto, padding: '1.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <h1 style={{ color: colors.vino, fontSize: '1.3rem', margin: 0 }}>Editor de Reflexiones</h1>
          <a href="/admin" style={{ fontSize: '0.8rem', color: colors.vino, textDecoration: 'none' }}>← Volver al admin</a>
        </div>

        {/* Date picker + position info */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label style={Object.assign({}, labelStyle, { marginTop: 0 })}>Fecha</label>
              <input
                type="date"
                value={date}
                onChange={function(e) { setDate(e.target.value) }}
                style={Object.assign({}, inputStyle(false), { width: 'auto', cursor: 'pointer' })}
              />
            </div>
            {loadingPos && <span style={{ fontSize: '0.82rem', color: '#aaa' }}>Calculando posición litúrgica…</span>}
            {!loadingPos && position && (
              <div>
                <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>Posición litúrgica</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: colors.vino }}>{posLabel}</div>
                {position.celebrationName && (
                  <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.15rem' }}>{position.celebrationName}</div>
                )}
              </div>
            )}
            {!loadingPos && position && position.toggleable === true && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: colors.texto }}>
                <input type="checkbox" checked={!!position.useFeast} onChange={handleToggleFeast} />
                {position.useFeast ? ('Fiesta: ' + position.celebrationName) : 'Feria'}
              </label>
            )}
            {posError && <span style={{ fontSize: '0.82rem', color: '#991b1b' }}>{posError}</span>}
          </div>
        </div>

        {/* Gospel reference (read-only) */}
        {(gospelRef || gospelText) && (
          <div style={{ backgroundColor: '#fdf8f0', border: '1px solid #e8dcc8', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: colors.oro, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Evangelio de referencia</div>
            {gospelRef && <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: colors.texto, marginBottom: '0.35rem' }}>{gospelRef}</div>}
            {gospelText && <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', maxHeight: '120px', overflow: 'auto' }}>{gospelText}</p>}
          </div>
        )}

        {loadingRef && (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '2rem', fontSize: '0.9rem' }}>Cargando reflexiones…</div>
        )}

        {/* Side-by-side editor */}
        {!loadingRef && position && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            <LangEditor
              lang="es"
              data={esData}
              onChange={handleChangeEs}
              onSave={function() { handleSave('es') }}
              saving={savingEs}
              saved={savedEs}
            />
            <LangEditor
              lang="en"
              data={enData}
              onChange={handleChangeEn}
              onSave={function() { handleSave('en') }}
              saving={savingEn}
              saved={savedEn}
            />
          </div>
        )}

      </div>
    </div>
  )
}
