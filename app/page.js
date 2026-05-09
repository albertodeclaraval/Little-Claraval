'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import ComingSoon from './page.comingsoon'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON !== 'false'

const colors = {
  pergamino: '#F8F1E6',
  vino: '#782F40',
  oro: '#B4903E',
  verde: '#4B643C',
  azul: '#3C5078',
  texto: '#2C1810',
}

const s = {
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
  badge: function(color) { return { display: 'inline-block', backgroundColor: color, color: 'white', borderRadius: '20px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', marginBottom: '1rem' } },
  btn: function(color) { return { backgroundColor: color, color: 'white', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem', width: '100%', marginTop: '0.75rem' } },
  journalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  journalCard: { backgroundColor: 'white', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', borderLeft: '3px solid ' + colors.oro },
  textarea: { width: '100%', minHeight: '200px', border: '1px solid #ddd', borderRadius: '6px', padding: '1rem', fontSize: '0.95rem', lineHeight: 1.8, resize: 'vertical', fontFamily: 'Georgia, serif', boxSizing: 'border-box', color: colors.texto },
  pricingCard: function(highlight) { return { backgroundColor: highlight ? colors.vino : 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', color: highlight ? 'white' : colors.texto } },
}

const journals = [
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

const TIER_LEVELS = { free: 0, peregrino: 1, discipulo: 2, claraval: 3 }

function getEffectiveTier(profile) {
  if (!profile) return 'free'
  var paidTier = profile.subscription_status === 'active' ? profile.subscription_tier : 'free'
  var giftTier = profile.gift_tier && profile.gift_expires_at && new Date(profile.gift_expires_at) > new Date() ? profile.gift_tier : 'free'
  var paidLevel = TIER_LEVELS[paidTier] || 0
  var giftLevel = TIER_LEVELS[giftTier] || 0
  return paidLevel >= giftLevel ? paidTier : giftTier
}

function ViewHoy({ tier }) {
  var canSeeReflection = (TIER_LEVELS[tier] || 0) >= 1
  return (
    <div style={s.content}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={s.badge(colors.verde)}>Tiempo Ordinario</div>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Evangelio del dia</div>
        <h2 style={s.h1}>Mateo 10, 7-13</h2>
        <p style={s.p}>Yendo, proclamad: El Reino de los Cielos esta cerca. Curad enfermos, resucitad muertos, purificad leprosos, expulsad demonios. Gratis lo recibisteis, dadlo gratis.</p>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Reflexion - Alberto De Claraval</div>
        {canSeeReflection ? (
          <p style={s.p}>Jesus no manda a predicar con palabras vacias. Manda a predicar con obras que cuestan. Gratis recibiste la misericordia, gratis, es decir, sin merecerla. Ahora sal y dala. No hay tiempo para negociar los terminos.</p>
        ) : (
          <>
            <div style={Object.assign({}, s.badge(colors.vino), { fontSize: '0.7rem' })}>PREMIUM - Nivel Peregrino</div>
            <p style={Object.assign({}, s.p, { filter: 'blur(4px)', userSelect: 'none' })}>Jesus no manda a predicar con palabras vacias. Manda a predicar con obras que cuestan. Gratis recibiste la misericordia, gratis, es decir, sin merecerla. Ahora sal y dala.</p>
            <button style={s.btn(colors.vino)}>Desbloquear reflexion - $1.99/mes</button>
          </>
        )}
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Santo del dia</div>
        <h2 style={Object.assign({}, s.h1, { fontSize: '1.1rem' })}>San Augusto Chapdelaine</h2>
        <p style={s.p}>Martir misionero en China. Testimonio de que el Evangelio vale mas que la propia vida.</p>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Laudes - Oracion de la manana</div>
        <p style={s.p}>Oh Dios, que abres el dia con tu luz, abre tambien mi corazon a tu presencia. Que nada de lo que haga hoy sea ajeno a Ti. Amen.</p>
      </div>
    </div>
  )
}

function ViewDiarios({ onOpen, tier, user }) {
  var journalLimit = tier === 'claraval' ? 999 : tier === 'discipulo' ? 3 : tier === 'peregrino' ? 1 : 0
  var [progress, setProgress] = useState({})

  useEffect(function() {
    if (!user) return
    supabase.from('journal_entries').select('journal_slug, day_number').eq('user_id', user.id)
      .then(function(res) {
        if (res.data) {
          var p = {}
          res.data.forEach(function(e) {
            if (!p[e.journal_slug] || e.day_number > p[e.journal_slug]) {
              p[e.journal_slug] = e.day_number
            }
          })
          setProgress(p)
        }
      })
  }, [user])

  return (
    <div style={s.content}>
      <h2 style={Object.assign({}, s.h1, { marginBottom: '0.25rem' })}>Mis Diarios</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>120 dias de encuentro diario con Dios</p>
      <div style={s.journalGrid}>
        {journals.map(function(j, i) {
          var locked = i >= journalLimit
          var currentDay = progress[j.slug] || 0
          var pct = Math.round((currentDay / 120) * 100)
          return (
            <div key={j.slug} style={Object.assign({}, s.journalCard, { opacity: locked ? 0.5 : 1, cursor: locked ? 'default' : 'pointer' })} onClick={function() { if (!locked) onOpen(j, currentDay + 1) }}>
              <div style={{ fontSize: '0.7rem', color: colors.oro, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                {locked ? 'Bloqueado' : 'Dia ' + (currentDay + 1) + ' / 120'}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.texto }}>{j.title}</div>
              {!locked && (
                <div style={{ height: '4px', backgroundColor: '#f0e8d8', borderRadius: '2px', marginTop: '0.75rem' }}>
                  <div style={{ height: '4px', width: pct + '%', backgroundColor: colors.oro, borderRadius: '2px' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ViewJournal({ journal, dayNumber, onBack, user }) {
  var [text, setText] = useState('')
  var [saving, setSaving] = useState(false)
  var [saved, setSaved] = useState(false)
  var [loading, setLoading] = useState(true)

  useEffect(function() {
    if (!user) return
    supabase.from('journal_entries')
      .select('content')
      .eq('user_id', user.id)
      .eq('journal_slug', journal.slug)
      .eq('day_number', dayNumber)
      .single()
      .then(function(res) {
        if (res.data) setText(res.data.content || '')
        setLoading(false)
      })
  }, [user, journal.slug, dayNumber])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    var existing = await supabase.from('journal_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('journal_slug', journal.slug)
      .eq('day_number', dayNumber)
      .single()

    if (existing.data) {
      await supabase.from('journal_entries')
        .update({ content: text, updated_at: new Date().toISOString() })
        .eq('id', existing.data.id)
    } else {
      await supabase.from('journal_entries')
        .insert({ user_id: user.id, journal_slug: journal.slug, day_number: dayNumber, content: text })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(function() { setSaved(false) }, 2000)
  }

  return (
    <div style={s.content}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: colors.vino, cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>Volver</button>
      <div style={s.card}>
        <div style={s.cardTitle}>{journal.title} - Dia {dayNumber}</div>
        <p style={Object.assign({}, s.p, { fontStyle: 'italic', color: colors.verde, marginBottom: '1rem' })}>Examiname, oh Dios, y conoce mi corazon. - Sal 139, 23</p>
        <p style={Object.assign({}, s.p, { marginBottom: '1rem' })}>Oracion de apertura: Senor, aqui estoy. Quiero verte en este dia que ya paso. Dame ojos limpios para reconocerte.</p>
        <p style={{ fontWeight: 'bold', color: colors.texto, marginBottom: '0.5rem', fontSize: '0.9rem' }}>En que momento del dia sentiste mas paz? Por que?</p>
        {loading ? (
          <p style={{ color: '#888' }}>Cargando...</p>
        ) : (
          <>
            <textarea style={s.textarea} value={text} onChange={function(e) { setText(e.target.value) }} placeholder="Escribe aqui..." />
            <button style={s.btn(saved ? colors.verde : colors.vino)} onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : saved ? 'Guardado!' : 'Guardar entrada'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ViewPricing({ onCheckout, loading, tier }) {
  var currentLevel = TIER_LEVELS[tier] || 0
  return (
    <div style={s.content}>
      <h2 style={Object.assign({}, s.h1, { marginBottom: '0.25rem' })}>Planes</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>El contenido liturgico siempre es gratuito.</p>
      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.verde)}>Gratuito</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Cuenta Gratuita</h3>
        <p style={Object.assign({}, s.p, { fontSize: '0.85rem' })}>Evangelio - Santo del dia - Laudes - Liturgia de las Horas - Rosario - Coronilla</p>
        {currentLevel === 0 && <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>Tu plan actual</div>}
      </div>
      <div style={s.pricingCard(currentLevel < 1)}>
        <div style={Object.assign({}, s.badge(colors.oro), { color: currentLevel < 1 ? colors.texto : 'white' })}>$1.99 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Peregrino</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Reflexion diaria + 1 journal interactivo</p>
        {currentLevel >= 1 ? (
          <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>Incluido en tu plan</div>
        ) : (
          <button style={Object.assign({}, s.btn(currentLevel < 1 ? 'white' : colors.vino), { color: currentLevel < 1 ? colors.vino : 'white' })} disabled={loading} onClick={function() { onCheckout('peregrino') }}>
            {loading ? 'Cargando...' : 'Suscribirse'}
          </button>
        )}
      </div>
      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.azul)}>$3.99 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Discipulo</h3>
        <p style={Object.assign({}, s.p, { fontSize: '0.85rem' })}>Reflexion diaria + 3 journals + historial</p>
        {currentLevel >= 2 ? (
          <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>Incluido en tu plan</div>
        ) : (
          <button style={s.btn(colors.azul)} disabled={loading} onClick={function() { onCheckout('discipulo') }}>
            {loading ? 'Cargando...' : 'Suscribirse'}
          </button>
        )}
      </div>
      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.vino)}>$5.99 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Claraval</h3>
        <p style={Object.assign({}, s.p, { fontSize: '0.85rem' })}>Todo: 9 journals + contenido futuro + acceso anticipado</p>
        {currentLevel >= 3 ? (
          <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>Tu plan actual</div>
        ) : (
          <button style={s.btn(colors.vino)} disabled={loading} onClick={function() { onCheckout('claraval') }}>
            {loading ? 'Cargando...' : 'Suscribirse'}
          </button>
        )}
      </div>
    </div>
  )
}

function ViewRedeem({ user }) {
  var [code, setCode] = useState('')
  var [msg, setMsg] = useState('')
  var [loading, setLoading] = useState(false)

  async function handleRedeem() {
    if (!code.trim()) return
    setLoading(true)
    setMsg('')
    try {
      var res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), userId: user.id }),
      })
      var data = await res.json()
      if (data.success) {
        setMsg(data.message)
        setCode('')
      } else {
        setMsg('Error: ' + data.error)
      }
    } catch (err) {
      setMsg('Error de conexion')
    }
    setLoading(false)
  }

  return (
    <div style={s.content}>
      <div style={s.card}>
        <div style={s.cardTitle}>Canjear codigo</div>
        <p style={Object.assign({}, s.p, { marginBottom: '1rem' })}>Si tienes un codigo promocional o de un journal fisico, ingrесalo aqui.</p>
        <input
          type="text"
          value={code}
          onChange={function(e) { setCode(e.target.value.toUpperCase()) }}
          placeholder="CODIGO"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1.1rem', textAlign: 'center', letterSpacing: '0.2em', fontFamily: 'Georgia, serif', boxSizing: 'border-box', color: colors.texto }}
        />
        <button style={s.btn(colors.vino)} onClick={handleRedeem} disabled={loading}>
          {loading ? 'Canjeando...' : 'Canjear'}
        </button>
        {msg && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: msg.includes('Error') ? '#fee2e2' : '#dcfce7', color: msg.includes('Error') ? '#991b1b' : '#166534' }}>
            {msg}
          </div>
        )}
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

  useEffect(function() {
    async function init() {
      var session = await supabase.auth.getSession()
      if (session.data.session) {
        setUser(session.data.session.user)
        var prof = await supabase.from('profiles').select('*').eq('id', session.data.session.user.id).single()
        if (prof.data) setProfile(prof.data)
      }
    }
    init()
  }, [])

  var tier = getEffectiveTier(profile)

  async function handleCheckout(plan) {
    if (!user) { window.location.href = '/login'; return }
    setLoading(true)
    try {
      var variantMap = {
        peregrino: process.env.NEXT_PUBLIC_LS_VARIANT_PEREGRINO,
        discipulo: process.env.NEXT_PUBLIC_LS_VARIANT_DISCIPULO,
        claraval: process.env.NEXT_PUBLIC_LS_VARIANT_CLARAVAL,
      }
      var res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: variantMap[plan], userId: user.id, userEmail: user.email }),
      })
      var data = await res.json()
      if (data.checkoutUrl) { window.location.href = data.checkoutUrl }
      else { alert('Error al iniciar el pago.') }
    } catch (err) { alert('Error de conexion.') }
    setLoading(false)
  }

  var handleLogout = async function() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

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
          {user && <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.7rem' }}>Salir</button>}
        </div>
      </header>
      <nav style={s.nav}>
        {tabs.map(function(t) {
          return <button key={t.id} style={s.navBtn(vista === t.id)} onClick={function() { setVista(t.id); setJournalAbierto(null) }}>{t.label}</button>
        })}
      </nav>
      {vista === 'hoy' && <ViewHoy tier={tier} />}
      {vista === 'diarios' && !journalAbierto && <ViewDiarios onOpen={function(j, day) { setJournalAbierto(j); setJournalDay(day) }} tier={tier} user={user} />}
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
