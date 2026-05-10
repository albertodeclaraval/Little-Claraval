'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { fetchDailyReadings, fetchLiturgicalDay } from '../../lib/liturgical-api'

var supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
var ADMIN_EMAILS = ['betoyac@gmail.com', 'albertodeclaraval@gmail.com']
var colors = { pergamino: '#F8F1E6', vino: '#782F40', oro: '#B4903E', texto: '#2C1810', verde: '#4B643C', azul: '#3C5078' }

var DAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
var MONTH_NAMES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

var SEASON_ES = {
  easter: 'Tiempo de Pascua', christmas: 'Navidad',
  advent: 'Adviento', lent: 'Cuaresma',
  'ordinary time': 'Tiempo Ordinario', ordinary: 'Tiempo Ordinario',
  pascua: 'Tiempo de Pascua', navidad: 'Navidad', adviento: 'Adviento', cuaresma: 'Cuaresma',
}

function getSeasonEs(season) {
  if (!season) return ''
  var s = season.toLowerCase()
  for (var key in SEASON_ES) { if (s.includes(key)) return SEASON_ES[key] }
  return season
}

function formatDate(date) {
  var d = date instanceof Date ? date : new Date(date + 'T12:00:00')
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

function todayString() { return formatDate(new Date()) }

function getWeekDates() {
  var today = new Date()
  var day = today.getDay()
  var diff = day === 0 ? -6 : 1 - day
  var monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  var dates = []
  for (var i = 0; i < 7; i++) {
    var d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d)
  }
  return dates
}

function emptyForm() {
  return {
    firstReadingRefEs: '', firstReadingTextEs: '', firstReadingTextEn: '',
    psalmRefEs: '', psalmTextEs: '', psalmTextEn: '',
    secondReadingRefEs: '', secondReadingTextEs: '', secondReadingTextEn: '',
    gospelRefEs: '', gospelTextEs: '', gospelTextEn: '',
  }
}

function inputStyle() {
  return { width: '100%', padding: '0.4rem 0.6rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', boxSizing: 'border-box', color: colors.texto }
}

function textareaStyle(rows) {
  return { width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', lineHeight: 1.75, resize: 'vertical', fontFamily: 'Georgia, serif', boxSizing: 'border-box', minHeight: (rows * 1.75 * 14 + 24) + 'px', color: colors.texto }
}

function labelStyle() {
  return { fontSize: '0.72rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }
}

function ReadingSection({ label, isGospel, refEsKey, textEsKey, textEnKey, form, updateForm }) {
  var [showEn, setShowEn] = useState(false)
  return (
    <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e8dcc8' }}>
      <div style={{ fontSize: '0.7rem', color: isGospel ? colors.vino : '#999', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '0.75rem' }}>
        {label}
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={labelStyle()}>Referencia en español</label>
        <input type="text" value={form[refEsKey]} onChange={function(e) { updateForm(refEsKey, e.target.value) }} style={inputStyle()} placeholder="Ej: Hch 16, 1-10" />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={labelStyle()}>Texto en español</label>
        <textarea value={form[textEsKey]} onChange={function(e) { updateForm(textEsKey, e.target.value) }} style={textareaStyle(8)} placeholder="Pega el texto completo aquí..." />
      </div>
      <button
        onClick={function() { setShowEn(!showEn) }}
        style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.75rem', cursor: 'pointer', padding: 0, marginBottom: showEn ? '0.5rem' : 0 }}
      >
        {showEn ? '▾ Ocultar texto en inglés' : '▸ Añadir texto en inglés (opcional)'}
      </button>
      {showEn && (
        <textarea value={form[textEnKey]} onChange={function(e) { updateForm(textEnKey, e.target.value) }} style={Object.assign({}, textareaStyle(6), { display: 'block', marginTop: '0.4rem' })} placeholder="Paste full text in English here..." />
      )}
    </div>
  )
}

export default function LecturasAdminPage() {
  var [authorized, setAuthorized] = useState(false)
  var [token, setToken] = useState(null)
  var [selectedDate, setSelectedDate] = useState(todayString())
  var [apiData, setApiData] = useState(null)
  var [hasSupabaseData, setHasSupabaseData] = useState(false)
  var [form, setForm] = useState(emptyForm())
  var [showWeek, setShowWeek] = useState(false)
  var [weekDates] = useState(getWeekDates)
  var [loadedDates, setLoadedDates] = useState([])
  var [monthTotal, setMonthTotal] = useState(0)
  var [loadingApi, setLoadingApi] = useState(false)
  var [saving, setSaving] = useState(false)
  var [msg, setMsg] = useState('')

  useEffect(function() {
    supabase.auth.getSession().then(function(res) {
      if (res.data.session && ADMIN_EMAILS.includes(res.data.session.user.email)) {
        setAuthorized(true)
        setToken(res.data.session.access_token)
        loadMonthProgress(res.data.session.access_token)
      }
    })
  }, [])

  function loadMonthProgress(tk) {
    var now = new Date()
    var month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
    fetch('/api/admin/lecturas?month=' + month, { headers: { Authorization: 'Bearer ' + tk } })
      .then(function(r) { return r.json() })
      .then(function(d) { if (d.dates) { setLoadedDates(d.dates); setMonthTotal(d.total) } })
  }

  function updateForm(key, value) {
    setForm(function(prev) { return Object.assign({}, prev, { [key]: value }) })
  }

  useEffect(function() {
    if (!authorized || !token || !selectedDate) return
    setLoadingApi(true)
    setApiData(null)
    setHasSupabaseData(false)
    setMsg('')

    var apiDate = new Date(selectedDate + 'T12:00:00')

    Promise.all([
      fetchDailyReadings(apiDate),
      fetchLiturgicalDay(apiDate),
      fetch('/api/admin/lecturas?date=' + selectedDate, { headers: { Authorization: 'Bearer ' + token } }).then(function(r) { return r.json() })
    ]).then(function(results) {
      var rd = results[0]
      var lt = results[1]
      var sbData = results[2].data

      setApiData({ readings: rd, liturgical: lt })

      if (sbData) {
        setHasSupabaseData(true)
        setForm({
          firstReadingRefEs: sbData.first_reading_ref_es || (rd && rd.readings && rd.readings.firstReading) || '',
          firstReadingTextEs: sbData.first_reading_text_es || '',
          firstReadingTextEn: sbData.first_reading_text_en || '',
          psalmRefEs: sbData.psalm_ref_es || (rd && rd.readings && rd.readings.psalm) || '',
          psalmTextEs: sbData.psalm_text_es || '',
          psalmTextEn: sbData.psalm_text_en || '',
          secondReadingRefEs: sbData.second_reading_ref_es || (rd && rd.readings && rd.readings.secondReading) || '',
          secondReadingTextEs: sbData.second_reading_text_es || '',
          secondReadingTextEn: sbData.second_reading_text_en || '',
          gospelRefEs: sbData.gospel_ref_es || (rd && rd.readings && rd.readings.gospel) || '',
          gospelTextEs: sbData.gospel_text_es || '',
          gospelTextEn: sbData.gospel_text_en || '',
        })
      } else {
        var newForm = emptyForm()
        if (rd && rd.readings) {
          newForm.firstReadingRefEs = rd.readings.firstReading || ''
          newForm.psalmRefEs = rd.readings.psalm || ''
          newForm.secondReadingRefEs = rd.readings.secondReading || ''
          newForm.gospelRefEs = rd.readings.gospel || ''
        }
        setForm(newForm)
      }
      setLoadingApi(false)
    }).catch(function() { setLoadingApi(false) })
  }, [selectedDate, authorized, token])

  async function handleSave() {
    if (!token) return
    setSaving(true)
    setMsg('')

    var rd = apiData && apiData.readings
    var lt = apiData && apiData.liturgical

    try {
      var res = await fetch('/api/admin/lecturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          date: selectedDate,
          season: (rd && rd.season) || (lt && lt.season) || '',
          celebration: lt && lt.celebration ? (lt.celebration.name || '') : '',
          readings: {
            firstReadingRef: rd && rd.readings && rd.readings.firstReading || null,
            firstReadingRefEs: form.firstReadingRefEs,
            firstReadingTextEs: form.firstReadingTextEs,
            firstReadingTextEn: form.firstReadingTextEn,
            psalmRef: rd && rd.readings && rd.readings.psalm || null,
            psalmRefEs: form.psalmRefEs,
            psalmTextEs: form.psalmTextEs,
            psalmTextEn: form.psalmTextEn,
            secondReadingRef: rd && rd.readings && rd.readings.secondReading || null,
            secondReadingRefEs: form.secondReadingRefEs || null,
            secondReadingTextEs: form.secondReadingTextEs || null,
            secondReadingTextEn: form.secondReadingTextEn || null,
            gospelRef: rd && rd.readings && rd.readings.gospel || null,
            gospelRefEs: form.gospelRefEs,
            gospelTextEs: form.gospelTextEs,
            gospelTextEn: form.gospelTextEn,
          }
        })
      })
      var d = await res.json()
      if (d.success) {
        setMsg('Lecturas guardadas correctamente')
        setHasSupabaseData(true)
        loadMonthProgress(token)
      } else {
        setMsg('Error: ' + d.error)
      }
    } catch (e) {
      setMsg('Error de conexion')
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

  var rd = apiData && apiData.readings
  var lt = apiData && apiData.liturgical
  var apiRd = rd && rd.readings
  var seasonLabel = getSeasonEs((rd && rd.season) || (lt && lt.season) || '')
  var hasSecondReading = apiRd && apiRd.secondReading

  var now = new Date()
  var currentMonthName = MONTH_NAMES[now.getMonth()]

  return (
    <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', fontFamily: 'Georgia, serif', color: colors.texto, padding: '1.5rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ color: colors.vino, fontSize: '1.4rem', marginBottom: '0.25rem' }}>Editor de Lecturas</h1>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              {loadedDates.length}/{monthTotal} días cargados · {currentMonthName} {now.getFullYear()}
            </p>
          </div>
          <a href="/admin" style={{ fontSize: '0.8rem', color: colors.vino, textDecoration: 'none' }}>← Volver al admin</a>
        </div>

        {/* Progress bar */}
        {monthTotal > 0 && (
          <div style={{ backgroundColor: '#e8dcc8', borderRadius: '4px', height: '6px', marginBottom: '1.25rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: Math.round((loadedDates.length / monthTotal) * 100) + '%', backgroundColor: colors.verde, borderRadius: '4px', transition: 'width 0.3s' }} />
          </div>
        )}

        {/* Week view toggle */}
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            onClick={function() { setShowWeek(!showWeek) }}
            style={{ backgroundColor: showWeek ? colors.vino : 'white', color: showWeek ? 'white' : colors.vino, border: '1px solid ' + colors.vino, borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {showWeek ? 'Ocultar semana' : 'Ver semana actual'}
          </button>
        </div>

        {/* Week strip */}
        {showWeek && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Semana actual · haz clic para editar</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {weekDates.map(function(d) {
                var ds = formatDate(d)
                var isLoaded = loadedDates.includes(ds)
                var isSelected = ds === selectedDate
                var isToday = ds === todayString()
                return (
                  <button
                    key={ds}
                    onClick={function() { setSelectedDate(ds); setShowWeek(false) }}
                    style={{
                      flex: '1', minWidth: '40px', padding: '0.5rem 0.25rem', borderRadius: '6px', cursor: 'pointer',
                      border: isSelected ? '2px solid ' + colors.vino : '2px solid transparent',
                      backgroundColor: isLoaded ? '#dcfce7' : '#f5f5f5',
                      color: isSelected ? colors.vino : colors.texto,
                      fontSize: '0.8rem', fontFamily: 'Georgia, serif', fontWeight: isToday ? 'bold' : 'normal'
                    }}
                  >
                    <div>{DAY_NAMES_SHORT[d.getDay()]}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{d.getDate()}</div>
                    <div style={{ fontSize: '0.6rem', color: isLoaded ? colors.verde : '#ccc', marginTop: '0.2rem' }}>{isLoaded ? '✓' : '·'}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Date picker */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666', flexShrink: 0 }}>Fecha</label>
          <input
            type="date"
            value={selectedDate}
            onChange={function(e) { setSelectedDate(e.target.value) }}
            style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '0.4rem 0.6rem', fontSize: '0.9rem', color: colors.texto, flex: 1 }}
          />
          {hasSupabaseData && (
            <span style={{ fontSize: '0.72rem', backgroundColor: '#dcfce7', color: colors.verde, borderRadius: '12px', padding: '0.2rem 0.6rem', flexShrink: 0 }}>Cargado ✓</span>
          )}
        </div>

        {/* Form */}
        {loadingApi ? (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: '#aaa', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            Cargando lecturas de la API...
          </div>
        ) : !apiData ? null : (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1rem' }}>

            {/* Season + API refs header */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e8dcc8' }}>
              {seasonLabel && (
                <span style={{ display: 'inline-block', backgroundColor: colors.oro, color: 'white', borderRadius: '20px', padding: '0.2rem 0.8rem', fontSize: '0.72rem', marginBottom: '0.75rem' }}>
                  {seasonLabel}
                </span>
              )}
              <p style={{ fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Referencias de la API</p>
              {apiRd && apiRd.firstReading && <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>• Primera Lectura: {apiRd.firstReading}</p>}
              {apiRd && apiRd.psalm && <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>• Salmo: {apiRd.psalm}</p>}
              {apiRd && apiRd.secondReading && <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>• Segunda Lectura: {apiRd.secondReading}</p>}
              {apiRd && apiRd.gospel && <p style={{ fontSize: '0.85rem', color: '#666' }}>• Evangelio: {apiRd.gospel}</p>}
              {!apiRd && <p style={{ fontSize: '0.85rem', color: '#aaa', fontStyle: 'italic' }}>No se pudo cargar la API para esta fecha.</p>}
            </div>

            <ReadingSection label="Primera Lectura" refEsKey="firstReadingRefEs" textEsKey="firstReadingTextEs" textEnKey="firstReadingTextEn" form={form} updateForm={updateForm} />
            <ReadingSection label="Salmo" refEsKey="psalmRefEs" textEsKey="psalmTextEs" textEnKey="psalmTextEn" form={form} updateForm={updateForm} />
            {hasSecondReading && (
              <ReadingSection label="Segunda Lectura" refEsKey="secondReadingRefEs" textEsKey="secondReadingTextEs" textEnKey="secondReadingTextEn" form={form} updateForm={updateForm} />
            )}
            <ReadingSection label="Evangelio" isGospel={true} refEsKey="gospelRefEs" textEsKey="gospelTextEs" textEnKey="gospelTextEn" form={form} updateForm={updateForm} />

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ backgroundColor: colors.vino, color: 'white', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', cursor: saving ? 'not-allowed' : 'pointer', width: '100%', fontSize: '0.95rem', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Guardando...' : 'Guardar lecturas del día'}
            </button>

            {msg && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: msg.includes('Error') ? '#991b1b' : colors.verde, fontWeight: 'bold', textAlign: 'center' }}>
                {msg}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
