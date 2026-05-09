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
  nav: { display: 'flex', justifyContent: 'space-around', backgroundColor: 'white', borderBottom: `2px solid ${colors.oro}`, padding: '0.5rem' },
  navBtn: (active) => ({ background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', color: active ? colors.vino : '#888', fontWeight: active ? 'bold' : 'normal', borderBottom: active ? `2px solid ${colors.vino}` : '2px solid transparent' }),
  content: { maxWidth: '680px', margin: '0 auto', padding: '1.5rem' },
  card: { backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cardTitle: { color: colors.vino, fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' },
  h1: { fontSize: '1.5rem', color: colors.texto, marginBottom: '0.5rem', lineHeight: 1.3 },
  p: { lineHeight: 1.8, fontSize: '0.95rem', color: '#444' },
  badge: (color) => ({ display: 'inline-block', backgroundColor: color, color: 'white', borderRadius: '20px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', marginBottom: '1rem' }),
  btn: (color) => ({ backgroundColor: color, color: 'white', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem', width: '100%', marginTop: '0.75rem' }),
  journalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  journalCard: { backgroundColor: 'white', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', borderLeft: `3px solid ${colors.oro}` },
  textarea: { width: '100%', minHeight: '200px', border: '1px solid #ddd', borderRadius: '6px', padding: '1rem', fontSize: '0.95rem', lineHeight: 1.8, resize: 'vertical', fontFamily: 'Georgia, serif', boxSizing: 'border-box' },
  pricingCard: (highlight) => ({ backgroundColor: highlight ? colors.vino : 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', color: highlight ? 'white' : colors.texto }),
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
  const paidTier = profile.subscription_status === 'active' ? profile.subscription_tier : 'free'
  const giftTier = profile.gift_tier && profile.gift_expires_at && new Date(profile.gift_expires_at) > new Date() ? profile.gift_tier : 'free'
  const paidLevel = TIER_LEVELS[paidTier] || 0
  const giftLevel = TIER_LEVELS[giftTier] || 0
  return paidLevel >= giftLevel ? paidTier : giftTier
}

function ViewHoy({ tier }) {
  const canSeeReflection = (TIER_LEVELS[tier] || 0) >= 1
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
            <div style={{ ...s.badge(colors.vino), fontSize: '0.7rem' }}>PREMIUM - Nivel Peregrino</div>
            <p style={{ ...s.p, filter: 'blur(4px)', userSelect: 'none' }}>Jesus no manda a predicar con palabras vacias. Manda a predicar con obras que cuestan. Gratis recibiste la misericordia, gratis, es decir, sin merecerla. Ahora sal y dala.</p>
            <button style={s.btn(colors.vino)} onClick={() => window.scrollTo(0, 0)}>Desbloquear reflexion - $1.99/mes</button>
          </>
        )}
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Santo del dia</div>
        <h2 style={{ ...s.h1, fontSize: '1.1rem' }}>San Augusto Chapdelaine</h2>
        <p style={s.p}>Martir misionero en China. Testimonio de que el Evangelio vale mas que la propia vida.</p>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Laudes - Oracion de la manana</div>
        <p style={s.p}>Oh Dios, que abres el dia con tu luz, abre tambien mi corazon a tu presencia. Que nada de lo que haga hoy sea ajeno a Ti. Amen.</p>
      </div>
    </div>
  )
}

function ViewDiarios({ onOpen, tier }) {
  const journalLimit = tier === 'claraval' ? 999 : tier === 'discipulo' ? 3 : tier === 'peregrino' ? 1 : 0
  return (
    <div style={s.content}>
      <h2 style={{ ...s.h1, marginBottom: '0.25rem' }}>Mis Diarios</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>120 dias de encuentro diario con Dios</p>
      <div style={s.journalGrid}>
        {journals.map((j, i) => {
          const locked = i >= journalLimit
          return (
            <div key={j.slug} style={{ ...s.journalCard, opacity: locked ? 0.5 : 1, cursor: locked ? 'default' : 'pointer' }} onClick={() => !locked && onOpen(j)}>
              <div style={{ fontSize: '0.7rem', color: colors.oro, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                {locked ? 'Bloqueado' : 'Dia 1 / 120'}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.texto }}>{j.title}</div>
              {!locked && (
                <div style={{ height: '4px', backgroundColor: '#f0e8d8', borderRadius: '2px', marginTop: '0.75rem' }}>
                  <div style={{ height: '4px', width: '1%', backgroundColor: colors.oro, borderRadius: '2px' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ViewJournal({ journal, onBack }) {
  const [text, setText] = useState('')
  return (
    <div style={s.content}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: colors.vino, cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>Volver</button>
      <div style={s.card}>
        <div style={s.cardTitle}>{journal.title} - Dia 1</div>
        <p style={{ ...s.p, fontStyle: 'italic', color: colors.verde, marginBottom: '1rem' }}>Examiname, oh Dios, y conoce mi corazon. - Sal 139, 23</p>
        <p style={{ ...s.p, marginBottom: '1rem' }}>Oracion de apertura: Senor, aqui estoy. Quiero verte en este dia que ya paso. Dame ojos limpios para reconocerte.</p>
        <p style={{ fontWeight: 'bold', color: colors.texto, marginBottom: '0.5rem', fontSize: '0.9rem' }}>En que momento del dia sentiste mas paz? Por que?</p>
        <textarea style={s.textarea} value={text} onChange={e => setText(e.target.value)} placeholder="Escribe aqui..." />
        <button style={s.btn(colors.vino)}>Guardar entrada</button>
      </div>
    </div>
  )
}

function ViewPricing({ onCheckout, loading, tier }) {
  const currentLevel = TIER_LEVELS[tier] || 0
  return (
    <div style={s.content}>
      <h2 style={{ ...s.h1, marginBottom: '0.25rem' }}>Planes</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>El contenido liturgico siempre es gratuito.</p>

      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.verde)}>Gratuito</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Cuenta Gratuita</h3>
        <p style={{ ...s.p, fontSize: '0.85rem' }}>Evangelio - Santo del dia - Laudes - Liturgia de las Horas - Rosario - Coronilla</p>
        {currentLevel === 0 && <div style={{ ...s.badge(colors.verde), marginTop: '0.75rem' }}>Tu plan actual</div>}
      </div>

      <div style={s.pricingCard(currentLevel < 1)}>
        <div style={{ ...s.badge(colors.oro), color: currentLevel < 1 ? colors.texto : 'white' }}>$1.99 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Peregrino</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Reflexion diaria + 1 journal interactivo</p>
        {currentLevel >= 1 ? (
          <div style={{ ...s.badge(colors.verde), marginTop: '0.75rem' }}>Incluido en tu plan</div>
        ) : (
          <button style={{ ...s.btn(currentLevel < 1 ? 'white' : colors.vino), color: currentLevel < 1 ? colors.vino : 'white' }} disabled={loading} onClick={() => onCheckout('peregrino')}>
            {loading ? 'Cargando...' : 'Suscribirse'}
          </button>
        )}
      </div>

      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.azul)}>$3.99 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Discipulo</h3>
        <p style={{ ...s.p, fontSize: '0.85rem' }}>Reflexion diaria + 3 journals + historial</p>
        {currentLevel >= 2 ? (
          <div style={{ ...s.badge(colors.verde), marginTop: '0.75rem' }}>Incluido en tu plan</div>
        ) : (
          <button style={s.btn(colors.azul)} disabled={loading} onClick={() => onCheckout('discipulo')}>
            {loading ? 'Cargando...' : 'Suscribirse'}
          </button>
        )}
      </div>

      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.vino)}>$5.99 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Claraval</h3>
        <p style={{ ...s.p, fontSize: '0.85rem' }}>Todo: 9 journals + contenido futuro + acceso anticipado</p>
        {currentLevel >= 3 ? (
          <div style={{ ...s.badge(colors.verde), marginTop: '0.75rem' }}>Tu plan actual</div>
        ) : (
          <button style={s.btn(colors.vino)} disabled={loading} onClick={() => onCheckout('claraval')}>
            {loading ? 'Cargando...' : 'Suscribirse'}
          </button>
        )}
      </div>
    </div>
  )
}

function App() {
  const [vista, setVista] = useState('hoy')
  const [journalAbierto, setJournalAbierto] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (data) setProfile(data)
      }
    }
    init()
  }, [])

  const tier = getEffectiveTier(profile)

  async function handleCheckout(plan) {
    if (!user) {
      window.location.href = '/login'
      return
    }
    setLoading(true)
    try {
      const variantMap = {
        peregrino: process.env.NEXT_PUBLIC_LS_VARIANT_PEREGRINO,
        discipulo: process.env.NEXT_PUBLIC_LS_VARIANT_DISCIPULO,
        claraval: process.env.NEXT_PUBLIC_LS_VARIANT_CLARAVAL,
      }
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: variantMap[plan],
          userId: user.id,
          userEmail: user.email,
        }),
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert('Error al iniciar el pago. Intenta de nuevo.')
      }
    } catch (err) {
      alert('Error de conexion. Intenta de nuevo.')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const tabs = [
    { id: 'hoy', label: 'Hoy' },
    { id: 'diarios', label: 'Diarios' },
    { id: 'precios', label: 'Planes' },
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
        {tabs.map(t => (
          <button key={t.id} style={s.navBtn(vista === t.id)} onClick={() => { setVista(t.id); setJournalAbierto(null) }}>
            {t.label}
          </button>
        ))}
      </nav>
      {vista === 'hoy' && <ViewHoy tier={tier} />}
      {vista === 'diarios' && !journalAbierto && <ViewDiarios onOpen={j => setJournalAbierto(j)} tier={tier} />}
      {vista === 'diarios' && journalAbierto && <ViewJournal journal={journalAbierto} onBack={() => setJournalAbierto(null)} />}
      {vista === 'precios' && <ViewPricing onCheckout={handleCheckout} loading={loading} tier={tier} />}
    </div>
  )
}

export default function Home() {
  if (isComingSoon) return <ComingSoon />
  return <App />
}
