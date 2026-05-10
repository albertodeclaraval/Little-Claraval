'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import ComingSoon from './page.comingsoon'
import { fetchDailyReadings, fetchLiturgicalDay } from './lib/liturgical-api'
import { fetchSaint, fetchReflection, fetchLiturgyHour, fetchRosary, fetchChaplet, fetchAppLinks } from './lib/content'

var supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

var isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON !== 'false'

var colors = {
  pergamino: '#F8F1E6', vino: '#782F40', oro: '#B4903E',
  verde: '#4B643C', azul: '#3C5078', texto: '#2C1810',
}

var s = {
  app: { backgroundColor: colors.pergamino, minHeight: '100vh', fontFamily: 'Georgia, serif', color: colors.texto },
  header: { backgroundColor: colors.vino, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: 'white', fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '0.05em' },
  nav: { display: 'flex', justifyContent: 'space-around', backgroundColor: 'white', borderBottom: '2px solid ' + colors.oro, padding: '0.5rem' },
  navBtn: function(active) { return { background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', color: active ? colors.vino : '#888', fontWeight: active ? 'bold' : 'normal', borderBottom: active ? '2px solid ' + colors.vino : '2px solid transparent' } },
  content: { maxWidth: '680px', margin: '0 auto', padding: '1.5rem' },
  card: { backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cardTitle: { color: colors.vino, fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' },
  h1: { fontSize: '1.5rem', color: colors.texto, marginBottom: '0.5rem', lineHeight: 1.3 },
  p: { lineHeight: 1.8, fontSize: '0.95rem', color: '#444' },
  badge: function(c) { return { display: 'inline-block', backgroundColor: c, color: 'white', borderRadius: '20px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', marginBottom: '1rem' } },
  btn: function(c) { return { backgroundColor: c, color: 'white', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem', width: '100%', marginTop: '0.75rem' } },
  journalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  journalCard: { backgroundColor: 'white', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', borderLeft: '3px solid ' + colors.oro },
  textarea: { width: '100%', minHeight: '200px', border: '1px solid #ddd', borderRadius: '6px', padding: '1rem', fontSize: '0.95rem', lineHeight: 1.8, resize: 'vertical', fontFamily: 'Georgia, serif', boxSizing: 'border-box', color: colors.texto },
  pricingCard: function(h) { return { backgroundColor: h ? colors.vino : 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', color: h ? 'white' : colors.texto } },
}

var journals = [
  { slug: 'examen', title: 'Examen del Dia' },
  { slug: 'paz', title: 'Paz Verdadera' },
  { slug: 'fortaleza', title: 'Fortaleza' },
  { slug: 'fiat', title: 'Fiat' },
  { slug: 'verbum', title: 'Verbum' },
  { slug: 'magnificat', title: 'Magnificat' },
  { slug: 'confiteor', title: 'Confiteor' },
  { slug: 'lumen', title: 'Lumen' },
  { slug: 'miles', title: 'Miles Christi' },
]

var TIER_LEVELS = { free: 0, peregrino: 1, discipulo: 2, claraval: 3 }

function getEffectiveTier(profile) {
  if (!profile) return 'free'
  var paid = profile.subscription_status === 'active' ? profile.subscription_tier : 'free'
  var gift = profile.gift_tier && profile.gift_expires_at && new Date(profile.gift_expires_at) > new Date() ? profile.gift_tier : 'free'
  return (TIER_LEVELS[paid] || 0) >= (TIER_LEVELS[gift] || 0) ? paid : gift
}

var SEASON_COLORS = {
  easter: colors.oro, pascua: colors.oro,
  christmas: colors.oro, navidad: colors.oro,
  advent: '#7B5EA7', adviento: '#7B5EA7',
  lent: '#7B5EA7', cuaresma: '#7B5EA7',
  ordinary: colors.verde
}

var SEASON_ES = {
  easter: 'Tiempo de Pascua', christmas: 'Navidad',
  advent: 'Adviento', lent: 'Cuaresma',
  'ordinary time': 'Tiempo Ordinario', ordinary: 'Tiempo Ordinario',
  pentecost: 'Pentecostés'
}

var ROSARY_NAMES = {
  0: 'Misterios Gloriosos', 1: 'Misterios Gozosos',
  2: 'Misterios Dolorosos', 3: 'Misterios Gloriosos',
  4: 'Misterios Luminosos', 5: 'Misterios Dolorosos',
  6: 'Misterios Gozosos'
}

function getSeasonColor(season) {
  if (!season) return colors.verde
  var s = season.toLowerCase()
  for (var key in SEASON_COLORS) {
    if (s.includes(key)) return SEASON_COLORS[key]
  }
  return colors.verde
}

function getSeasonEs(season) {
  if (!season) return 'Tiempo Ordinario'
  var s = season.toLowerCase()
  for (var key in SEASON_ES) {
    if (s.includes(key)) return SEASON_ES[key]
  }
  return season
}

function Accordion({ title, isOpen, onToggle, highlight, children }) {
  return (
    <div style={{ marginBottom: '0.25rem' }}>
      <div
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', cursor: 'pointer', borderBottom: isOpen ? 'none' : '1px solid #f0e8d8' }}
      >
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: highlight ? colors.vino : colors.texto }}>
          {title}
        </span>
        <span style={{ color: colors.vino, fontSize: '0.85rem', flexShrink: 0, marginLeft: '0.5rem' }}>
          {isOpen ? '▾' : '▸'}
        </span>
      </div>
      {isOpen && <div style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>{children}</div>}
    </div>
  )
}

function Proximamente() {
  return <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>Próximamente</p>
}

function ViewHoy({ tier, onSwitchView }) {
  var canReflection = (TIER_LEVELS[tier] || 0) >= 1

  var today = new Date()
  var year = today.getFullYear()
  var mo = String(today.getMonth() + 1).padStart(2, '0')
  var dy = String(today.getDate()).padStart(2, '0')
  var dateStr = year + '-' + mo + '-' + dy
  var monthDay = mo + '-' + dy
  var weekday = today.getDay()
  var hour = today.getHours()

  var [readings, setReadings] = useState(null)
  var [litDay, setLitDay] = useState(null)
  var [saint, setSaint] = useState(null)
  var [reflection, setReflection] = useState(null)
  var [lh, setLh] = useState({ laudes: null, visperas: null, completas: null })
  var [rosary, setRosary] = useState(null)
  var [chaplet, setChaplet] = useState(null)
  var [appLinks, setAppLinks] = useState([])
  var [loading, setLoading] = useState(true)
  var [open, setOpen] = useState({
    laudes: hour >= 5 && hour < 12,
    visperas: hour >= 12 && hour < 20,
    completas: hour >= 20 || hour < 5,
    rosario: false,
    coronilla: false
  })

  useEffect(function() {
    Promise.all([
      fetchDailyReadings(today),
      fetchLiturgicalDay(today),
      fetchSaint(monthDay),
      fetchReflection(dateStr, 'es'),
      fetchLiturgyHour('laudes', null, null, null, 'es'),
      fetchLiturgyHour('visperas', null, null, null, 'es'),
      fetchLiturgyHour('completas', null, null, null, 'es'),
      fetchRosary(weekday, 'es'),
      fetchChaplet('es'),
      fetchAppLinks()
    ]).then(function(r) {
      setReadings(r[0])
      setLitDay(r[1])
      setSaint(r[2])
      setReflection(r[3])
      setLh({ laudes: r[4], visperas: r[5], completas: r[6] })
      setRosary(r[7])
      setChaplet(r[8])
      setAppLinks(r[9] || [])
      setLoading(false)
    })
  }, [])

  function toggle(key) {
    setOpen(function(prev) { return Object.assign({}, prev, { [key]: !prev[key] }) })
  }

  var season = (readings && readings.season) || (litDay && litDay.season) || ''
  var seasonColor = getSeasonColor(season)
  var seasonEs = getSeasonEs(season)
  var celebration = litDay && litDay.celebration
  var rd = readings && readings.readings

  if (loading) {
    return <div style={Object.assign({}, s.content, { textAlign: 'center', color: '#aaa', paddingTop: '3rem' })}>Cargando...</div>
  }

  return (
    <div style={s.content}>

      {/* Encabezado litúrgico */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={s.badge(seasonColor)}>{seasonEs}</div>
        {celebration && celebration.type && (
          <div style={{ fontSize: '0.72rem', color: '#999', marginTop: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {celebration.type}
          </div>
        )}
      </div>

      {/* A) Lecturas del día */}
      <div style={Object.assign({}, s.card, { borderLeft: '3px solid ' + seasonColor })}>
        <div style={s.cardTitle}>Lecturas del Día</div>
        {!rd ? (
          <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>
            No se pudieron cargar las lecturas. Verifica tu conexión.
          </p>
        ) : (
          <>
            {rd.firstReading && (
              <div className="reading-block">
                <div className="reading-label">Primera Lectura</div>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.texto, margin: 0 }}>{rd.firstReading}</p>
              </div>
            )}
            {rd.psalm && (
              <div className="reading-block">
                <div className="reading-label">Salmo</div>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.texto, margin: 0 }}>{rd.psalm}</p>
              </div>
            )}
            {rd.secondReading && (
              <div className="reading-block">
                <div className="reading-label">Segunda Lectura</div>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.texto, margin: 0 }}>{rd.secondReading}</p>
              </div>
            )}
            {rd.gospel && (
              <div className="reading-block" style={{ borderBottom: 'none', marginBottom: 0 }}>
                <div className="reading-label">Evangelio</div>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.vino, margin: 0 }}>{rd.gospel}</p>
              </div>
            )}
            {readings.usccbLink && (
              <a
                href={readings.usccbLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.8rem', color: colors.azul, textDecoration: 'none' }}
              >
                Leer texto completo en USCCB →
              </a>
            )}
          </>
        )}
      </div>

      {/* B) Reflexión */}
      <div style={s.card}>
        <div style={s.cardTitle}>Reflexión — Alberto de Claraval</div>
        {!reflection ? (
          <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>Reflexión en preparación...</p>
        ) : canReflection ? (
          <div>
            {reflection.content && reflection.content.silencio && (
              <p style={Object.assign({}, s.p, { fontStyle: 'italic', color: '#777', marginBottom: '1rem' })}>
                {reflection.content.silencio}
              </p>
            )}
            {reflection.content && reflection.content.frase && (
              <p style={Object.assign({}, s.p, { fontWeight: 'bold', marginBottom: '1rem' })}>
                «{reflection.content.frase}»
              </p>
            )}
            {reflection.content && reflection.content.pregunta && (
              <p style={Object.assign({}, s.p, { color: colors.verde, marginBottom: '1rem' })}>
                {reflection.content.pregunta}
              </p>
            )}
            {reflection.content && reflection.content.oracion && (
              <p style={Object.assign({}, s.p, { fontStyle: 'italic' })}>
                {reflection.content.oracion}
              </p>
            )}
            {reflection.gospel_reference && (
              <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.75rem' }}>
                {reflection.gospel_reference}
              </p>
            )}
          </div>
        ) : (
          <>
            <div style={Object.assign({}, s.badge(colors.vino), { fontSize: '0.7rem', marginBottom: '0.75rem' })}>
              PREMIUM — Nivel Peregrino
            </div>
            <p style={Object.assign({}, s.p, { filter: 'blur(4px)', userSelect: 'none' })}>
              El silencio es el umbral de la contemplación. En él, Dios habla al corazón sin palabras.
              Detente un momento antes de comenzar el día y deja que la Palabra resuene en ti.
            </p>
            <button style={Object.assign({}, s.btn(colors.vino), { marginTop: '1rem' })} onClick={function() { onSwitchView && onSwitchView('precios') }}>
              Desbloquear — $1.99/mes
            </button>
          </>
        )}
      </div>

      {/* C) Santo del día */}
      <div style={s.card}>
        <div style={s.cardTitle}>Santo del Día</div>
        {!celebration && !saint ? (
          <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>Información no disponible</p>
        ) : (
          <>
            <h2 style={Object.assign({}, s.h1, { fontSize: '1.1rem', marginBottom: '0.4rem' })}>
              {saint ? (saint.name_es || (celebration && celebration.name)) : (celebration && celebration.name)}
            </h2>
            {celebration && celebration.type && (
              <div style={{ fontSize: '0.72rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                {celebration.type}
              </div>
            )}
            {saint && saint.bio_es ? (
              <p style={s.p}>{saint.bio_es}</p>
            ) : celebration && celebration.description ? (
              <p style={s.p}>{celebration.description}</p>
            ) : null}
            {saint && saint.patronage_es && (
              <p style={Object.assign({}, s.p, { fontStyle: 'italic', color: '#777', marginTop: '0.5rem', fontSize: '0.85rem' })}>
                Patrono/a de: {saint.patronage_es}
              </p>
            )}
            {saint && saint.prayer_es && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e8dcc8' }}>
                <div style={{ fontSize: '0.68rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Oración</div>
                <p style={Object.assign({}, s.p, { fontStyle: 'italic' })}>{saint.prayer_es}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* D) Liturgia de las Horas */}
      <div style={s.card}>
        <div style={s.cardTitle}>Liturgia de las Horas</div>
        <Accordion
          title={'Laudes' + (hour >= 5 && hour < 12 ? ' · Oración de la mañana' : '')}
          isOpen={open.laudes}
          onToggle={function() { toggle('laudes') }}
          highlight={hour >= 5 && hour < 12}
        >
          {lh.laudes && lh.laudes.content
            ? <p style={s.p}>{typeof lh.laudes.content === 'string' ? lh.laudes.content : JSON.stringify(lh.laudes.content)}</p>
            : <Proximamente />}
        </Accordion>
        <Accordion
          title={'Vísperas' + (hour >= 12 && hour < 20 ? ' · Oración de la tarde' : '')}
          isOpen={open.visperas}
          onToggle={function() { toggle('visperas') }}
          highlight={hour >= 12 && hour < 20}
        >
          {lh.visperas && lh.visperas.content
            ? <p style={s.p}>{typeof lh.visperas.content === 'string' ? lh.visperas.content : JSON.stringify(lh.visperas.content)}</p>
            : <Proximamente />}
        </Accordion>
        <Accordion
          title={'Completas' + ((hour >= 20 || hour < 5) ? ' · Oración de la noche' : '')}
          isOpen={open.completas}
          onToggle={function() { toggle('completas') }}
          highlight={hour >= 20 || hour < 5}
        >
          {lh.completas && lh.completas.content
            ? <p style={s.p}>{typeof lh.completas.content === 'string' ? lh.completas.content : JSON.stringify(lh.completas.content)}</p>
            : <Proximamente />}
        </Accordion>
      </div>

      {/* E) Rosario */}
      <div style={s.card}>
        <div
          onClick={function() { toggle('rosario') }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: open.rosario ? '0.75rem' : 0 }}
        >
          <div style={s.cardTitle}>Rosario del Día</div>
          <span style={{ color: colors.vino, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{open.rosario ? '▾' : '▸'}</span>
        </div>
        {open.rosario && (
          <div>
            <p style={{ fontSize: '0.85rem', color: colors.verde, fontWeight: 'bold', marginBottom: '0.75rem' }}>
              {ROSARY_NAMES[weekday]}
            </p>
            {rosary && rosary.mysteries && Array.isArray(rosary.mysteries) ? (
              rosary.mysteries.map(function(m, i) {
                return (
                  <div key={i} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: colors.vino, fontWeight: 'bold' }}>{i + 1}. </span>
                    <span style={s.p}>{typeof m === 'string' ? m : (m.title || m.name || '')}</span>
                  </div>
                )
              })
            ) : (
              <Proximamente />
            )}
          </div>
        )}
      </div>

      {/* F) Coronilla */}
      <div style={s.card}>
        <div
          onClick={function() { toggle('coronilla') }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: open.coronilla ? '0.75rem' : 0 }}
        >
          <div style={s.cardTitle}>Coronilla de la Divina Misericordia</div>
          <span style={{ color: colors.vino, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{open.coronilla ? '▾' : '▸'}</span>
        </div>
        {open.coronilla && (
          chaplet && chaplet.content
            ? <p style={s.p}>{typeof chaplet.content === 'string' ? chaplet.content : JSON.stringify(chaplet.content)}</p>
            : <Proximamente />
        )}
      </div>

      {/* G) Links Via Claraval */}
      {appLinks.length > 0 && (
        <div style={{ textAlign: 'center', paddingTop: '1.25rem', borderTop: '1px solid #e8dcc8', marginTop: '0.5rem' }}>
          <p style={{ fontSize: '0.68rem', color: '#bbb', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
            Via Claraval
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {appLinks.map(function(link) {
              return (
                <a
                  key={link.slug}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: colors.vino, textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  {link.icon && <span>{link.icon}</span>}
                  <span>{link.label_es || link.label_en}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

function ViewDiarios({ onOpen, tier, user }) {
  var limit = tier === 'claraval' ? 999 : tier === 'discipulo' ? 3 : tier === 'peregrino' ? 1 : 0
  var [progress, setProgress] = useState({})
  useEffect(function() {
    if (!user) return
    supabase.from('journal_entries').select('journal_slug, day_number').eq('user_id', user.id).then(function(r) {
      if (r.data) { var p = {}; r.data.forEach(function(e) { if (!p[e.journal_slug] || e.day_number > p[e.journal_slug]) p[e.journal_slug] = e.day_number }); setProgress(p) }
    })
  }, [user])
  return (
    <div style={s.content}>
      <h2 style={Object.assign({}, s.h1, { marginBottom: '0.25rem' })}>Mis Diarios</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>120 dias de encuentro diario con Dios</p>
      <div style={s.journalGrid}>
        {journals.map(function(j, i) {
          var locked = i >= limit; var day = progress[j.slug] || 0; var pct = Math.round((day / 120) * 100)
          return (
            <div key={j.slug} style={Object.assign({}, s.journalCard, { opacity: locked ? 0.5 : 1, cursor: locked ? 'default' : 'pointer' })} onClick={function() { if (!locked) onOpen(j, day + 1) }}>
              <div style={{ fontSize: '0.7rem', color: colors.oro, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{locked ? 'Bloqueado' : 'Dia ' + (day + 1) + ' / 120'}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.texto }}>{j.title}</div>
              {!locked && <div style={{ height: '4px', backgroundColor: '#f0e8d8', borderRadius: '2px', marginTop: '0.75rem' }}><div style={{ height: '4px', width: pct + '%', backgroundColor: colors.oro, borderRadius: '2px' }} /></div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ViewJournal({ journal, dayNumber, onBack, user }) {
  var [text, setText] = useState(''); var [saving, setSaving] = useState(false); var [saved, setSaved] = useState(false); var [loading, setLoading] = useState(true)
  useEffect(function() {
    if (!user) return
    supabase.from('journal_entries').select('content').eq('user_id', user.id).eq('journal_slug', journal.slug).eq('day_number', dayNumber).single().then(function(r) { if (r.data) setText(r.data.content || ''); setLoading(false) })
  }, [user, journal.slug, dayNumber])
  async function handleSave() {
    if (!user) return; setSaving(true)
    var ex = await supabase.from('journal_entries').select('id').eq('user_id', user.id).eq('journal_slug', journal.slug).eq('day_number', dayNumber).single()
    if (ex.data) { await supabase.from('journal_entries').update({ content: text, updated_at: new Date().toISOString() }).eq('id', ex.data.id) }
    else { await supabase.from('journal_entries').insert({ user_id: user.id, journal_slug: journal.slug, day_number: dayNumber, content: text }) }
    setSaving(false); setSaved(true); setTimeout(function() { setSaved(false) }, 2000)
  }
  return (
    <div style={s.content}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: colors.vino, cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>Volver</button>
      <div style={s.card}>
        <div style={s.cardTitle}>{journal.title} - Dia {dayNumber}</div>
        <p style={Object.assign({}, s.p, { fontStyle: 'italic', color: colors.verde, marginBottom: '1rem' })}>Examiname, oh Dios, y conoce mi corazon. - Sal 139, 23</p>
        {loading ? <p style={{ color: '#888' }}>Cargando...</p> : (
          <>
            <textarea style={s.textarea} value={text} onChange={function(e) { setText(e.target.value) }} placeholder="Escribe aqui..." />
            <button style={s.btn(saved ? colors.verde : colors.vino)} onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : saved ? 'Guardado!' : 'Guardar entrada'}</button>
          </>
        )}
      </div>
    </div>
  )
}

function ViewPricing({ onCheckout, loading, tier }) {
  var lv = TIER_LEVELS[tier] || 0
  return (
    <div style={s.content}>
      <h2 style={Object.assign({}, s.h1, { marginBottom: '0.25rem' })}>Planes</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>El contenido liturgico siempre es gratuito.</p>
      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.verde)}>Gratuito</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Cuenta Gratuita</h3>
        <p style={Object.assign({}, s.p, { fontSize: '0.85rem' })}>Evangelio - Santo del dia - Laudes - Liturgia de las Horas - Rosario - Coronilla</p>
        {lv === 0 && <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>Tu plan actual</div>}
      </div>
      <div style={s.pricingCard(lv < 1)}>
        <div style={Object.assign({}, s.badge(colors.oro), { color: lv < 1 ? colors.texto : 'white' })}>$1.99 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Peregrino</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Reflexion diaria + 1 journal</p>
        {lv >= 1 ? <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>Incluido</div> : <button style={Object.assign({}, s.btn('white'), { color: colors.vino })} disabled={loading} onClick={function() { onCheckout('peregrino') }}>{loading ? 'Cargando...' : 'Suscribirse'}</button>}
      </div>
      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.azul)}>$3.99 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Discipulo</h3>
        <p style={Object.assign({}, s.p, { fontSize: '0.85rem' })}>Reflexion + 3 journals</p>
        {lv >= 2 ? <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>Incluido</div> : <button style={s.btn(colors.azul)} disabled={loading} onClick={function() { onCheckout('discipulo') }}>{loading ? 'Cargando...' : 'Suscribirse'}</button>}
      </div>
      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.vino)}>$5.99 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Claraval</h3>
        <p style={Object.assign({}, s.p, { fontSize: '0.85rem' })}>Todo: 9 journals + contenido futuro</p>
        {lv >= 3 ? <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>Tu plan actual</div> : <button style={s.btn(colors.vino)} disabled={loading} onClick={function() { onCheckout('claraval') }}>{loading ? 'Cargando...' : 'Suscribirse'}</button>}
      </div>
    </div>
  )
}

function ViewRedeem({ user }) {
  var [code, setCode] = useState(''); var [msg, setMsg] = useState(''); var [ld, setLd] = useState(false)
  async function handleRedeem() {
    if (!code.trim()) return; setLd(true); setMsg('')
    try {
      var r = await fetch('/api/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: code.trim(), userId: user.id }) })
      var d = await r.json()
      if (d.success) { setMsg(d.message); setCode('') } else { setMsg('Error: ' + d.error) }
    } catch (e) { setMsg('Error de conexion') }
    setLd(false)
  }
  return (
    <div style={s.content}>
      <div style={s.card}>
        <div style={s.cardTitle}>Canjear codigo</div>
        <p style={Object.assign({}, s.p, { marginBottom: '1rem' })}>Si tienes un codigo promocional o de un journal fisico, ingresalo aqui.</p>
        <input type="text" value={code} onChange={function(e) { setCode(e.target.value.toUpperCase()) }} placeholder="CODIGO" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1.1rem', textAlign: 'center', letterSpacing: '0.2em', fontFamily: 'Georgia, serif', boxSizing: 'border-box', color: colors.texto }} />
        <button style={s.btn(colors.vino)} onClick={handleRedeem} disabled={ld}>{ld ? 'Canjeando...' : 'Canjear'}</button>
        {msg && <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: msg.includes('Error') ? '#fee2e2' : '#dcfce7', color: msg.includes('Error') ? '#991b1b' : '#166534' }}>{msg}</div>}
      </div>
    </div>
  )
}

function App() {
  var [vista, setVista] = useState('hoy')
  var [journalAbierto, setJournalAbierto] = useState(null)
  var [journalDay, setJournalDay] = useState(1)
  var [user, setUser] = useState(null)
  var [profile, setProfile] = useState(null)
  var [loading, setLoading] = useState(false)
  var [checking, setChecking] = useState(true)

  useEffect(function() {
    supabase.auth.getSession().then(function(res) {
      if (res.data.session) {
        setUser(res.data.session.user)
        supabase.from('profiles').select('*').eq('id', res.data.session.user.id).single().then(function(p) { if (p.data) setProfile(p.data) })
      } else {
        window.location.href = '/login'
      }
      setChecking(false)
    })
  }, [])

  var tier = getEffectiveTier(profile)

  async function handleCheckout(plan) {
    if (!user) { window.location.href = '/login'; return }
    setLoading(true)
    try {
      var vm = { peregrino: process.env.NEXT_PUBLIC_LS_VARIANT_PEREGRINO, discipulo: process.env.NEXT_PUBLIC_LS_VARIANT_DISCIPULO, claraval: process.env.NEXT_PUBLIC_LS_VARIANT_CLARAVAL }
      var r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ variantId: vm[plan], userId: user.id, userEmail: user.email }) })
      var d = await r.json()
      if (d.checkoutUrl) window.location.href = d.checkoutUrl
      else alert('Error al iniciar el pago.')
    } catch (e) { alert('Error de conexion.') }
    setLoading(false)
  }

  if (checking) return <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', color: colors.vino }}>Cargando...</div>

  var tabs = [
    { id: 'hoy', label: 'Hoy' },
    { id: 'diarios', label: 'Diarios' },
    { id: 'precios', label: 'Planes' },
    { id: 'canjear', label: 'Canjear' },
  ]

  return (
    <div style={s.app}>
      <header style={s.header}>
        <span style={s.logo}>Little Claraval</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>{user.email}</span>}
          {user && <button onClick={function() { supabase.auth.signOut().then(function() { window.location.href = '/login' }) }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.7rem' }}>Salir</button>}
        </div>
      </header>
      <nav style={s.nav}>
        {tabs.map(function(t) { return <button key={t.id} style={s.navBtn(vista === t.id)} onClick={function() { setVista(t.id); setJournalAbierto(null) }}>{t.label}</button> })}
      </nav>
      {vista === 'hoy' && <ViewHoy tier={tier} onSwitchView={setVista} />}
      {vista === 'diarios' && !journalAbierto && <ViewDiarios onOpen={function(j, d) { setJournalAbierto(j); setJournalDay(d) }} tier={tier} user={user} />}
      {vista === 'diarios' && journalAbierto && <ViewJournal journal={journalAbierto} dayNumber={journalDay} onBack={function() { setJournalAbierto(null) }} user={user} />}
      {vista === 'precios' && <ViewPricing onCheckout={handleCheckout} loading={loading} tier={tier} />}
      {vista === 'canjear' && <ViewRedeem user={user} />}
    </div>
  )
}

export default function Home() {
  if (isComingSoon) return <ComingSoon />
  return <App />
}
