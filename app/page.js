'use client'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

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
  nav: { display: 'flex', justifyContent: 'space-around', backgroundColor: 'white', borderBottom: '2px solid #B4903E', padding: '0.5rem' },
  navBtn: (active) => ({ background: 'none', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', color: active ? '#782F40' : '#888', fontWeight: active ? 'bold' : 'normal', borderBottom: active ? '2px solid #782F40' : '2px solid transparent' }),
  content: { maxWidth: '680px', margin: '0 auto', padding: '1.5rem' },
  card: { backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  cardTitle: { color: '#782F40', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' },
  h1: { fontSize: '1.5rem', color: '#2C1810', marginBottom: '0.5rem', lineHeight: 1.3 },
  p: { lineHeight: 1.8, fontSize: '0.95rem', color: '#444' },
  badge: (color) => ({ display: 'inline-block', backgroundColor: color, color: 'white', borderRadius: '20px', padding: '0.2rem 0.8rem', fontSize: '0.75rem', marginBottom: '1rem' }),
  btn: (color) => ({ backgroundColor: color, color: 'white', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem', width: '100%', marginTop: '0.75rem' }),
  journalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  journalCard: { backgroundColor: 'white', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', borderLeft: '3px solid #B4903E' },
  textarea: { width: '100%', minHeight: '200px', border: '1px solid #ddd', borderRadius: '6px', padding: '1rem', fontSize: '0.95rem', lineHeight: 1.8, resize: 'vertical', fontFamily: 'Georgia, serif', boxSizing: 'border-box' },
  pricingCard: (highlight) => ({ backgroundColor: highlight ? '#782F40' : 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', color: highlight ? 'white' : '#2C1810' }),
}

const journals = [
  { slug: 'examen', title: 'Examen del Dia', days: 120 },
  { slug: 'paz', title: 'Paz Verdadera', days: 120 },
  { slug: 'fortaleza', title: 'Fortaleza', days: 120 },
  { slug: 'fiat', title: 'Fiat', days: 120 },
  { slug: 'verbum', title: 'Verbum', days: 120 },
  { slug: 'magnificat', title: 'Magnificat', days: 120 },
  { slug: 'confiteor', title: 'Confiteor', days: 120 },
  { slug: 'lumen', title: 'Lumen', days: 120 },
  { slug: 'miles', title: 'Miles Christi', days: 120 },
]

function UserMenu() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function cerrarSesion() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) return (
    <a href="/login" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', textDecoration: 'none' }}>Iniciar sesion</a>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{user.email}</span>
      <button onClick={cerrarSesion} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '4px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer' }}>Salir</button>
    </div>
  )
}

function ViewHoy() {
  return (
    <div style={s.content}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={s.badge('#4B643C')}>Tiempo Ordinario</div>
        <p style={{ color: '#888', fontSize: '0.85rem' }}>Viernes 8 de mayo de 2026</p>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Evangelio del dia</div>
        <h2 style={s.h1}>Mateo 10, 7-13</h2>
        <p style={s.p}>Yendo, proclamad: El Reino de los Cielos esta cerca. Curad enfermos, resucitad muertos, purificad leprosos, expulsad demonios. Gratis lo recibisteis, dadlo gratis.</p>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Reflexion - Alberto De Claraval</div>
        <div style={s.badge('#782F40')}>PREMIUM</div>
        <p style={{ ...s.p, filter: 'blur(4px)', userSelect: 'none' }}>Jesus no manda a predicar con palabras vacias. Manda a predicar con obras que cuestan. Gratis recibiste la misericordia. Ahora sal y dala.</p>
        <button style={s.btn('#782F40')}>Desbloquear reflexion - $3/mes</button>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Santo del dia</div>
        <h2 style={{ ...s.h1, fontSize: '1.1rem' }}>San Augusto Chapdelaine</h2>
        <p style={s.p}>Martir misionero en China.</p>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Laudes</div>
        <p style={s.p}>Oh Dios, que abres el dia con tu luz, abre tambien mi corazon a tu presencia. Amen.</p>
      </div>
    </div>
  )
}

function ViewDiarios({ onOpen }) {
  return (
    <div style={s.content}>
      <h2 style={{ ...s.h1, marginBottom: '0.25rem' }}>Mis Diarios</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>120 dias de encuentro diario con Dios</p>
      <div style={s.journalGrid}>
        {journals.map(j => (
          <div key={j.slug} style={s.journalCard} onClick={() => onOpen(j)}>
            <div style={{ fontSize: '0.7rem', color: '#B4903E', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Dia 1 / {j.days}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2C1810' }}>{j.title}</div>
            <div style={{ height: '4px', backgroundColor: '#f0e8d8', borderRadius: '2px', marginTop: '0.75rem' }}>
              <div style={{ height: '4px', width: '1%', backgroundColor: '#B4903E', borderRadius: '2px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ViewJournal({ journal, onBack }) {
  const [text, setText] = useState('')
  return (
    <div style={s.content}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#782F40', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>Volver</button>
      <div style={s.card}>
        <div style={s.cardTitle}>{journal.title} - Dia 1</div>
        <p style={{ ...s.p, fontStyle: 'italic', color: '#4B643C', marginBottom: '1rem' }}>Examiname, oh Dios, y conoce mi corazon. Sal 139, 23</p>
        <p style={{ fontWeight: 'bold', color: '#2C1810', marginBottom: '0.5rem', fontSize: '0.9rem' }}>En que momento del dia sentiste mas paz?</p>
        <textarea style={s.textarea} value={text} onChange={e => setText(e.target.value)} placeholder="Escribe aqui..." />
        <button style={s.btn('#782F40')}>Guardar entrada</button>
      </div>
    </div>
  )
}

function ViewPricing() {
  return (
    <div style={s.content}>
      <h2 style={{ ...s.h1, marginBottom: '0.25rem' }}>Planes</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>El contenido liturgico siempre es gratuito.</p>
      <div style={s.pricingCard(false)}>
        <div style={s.badge('#4B643C')}>Gratuito</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Peregrino Gratuito</h3>
        <p style={{ ...s.p, fontSize: '0.85rem' }}>Evangelio - Santo del dia - Laudes - Visperas - Rosario - Completas</p>
      </div>
      <div style={s.pricingCard(true)}>
        <div style={s.badge('#B4903E')}>$3 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Peregrino</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Reflexion diaria + 1 journal interactivo</p>
        <button style={{ ...s.btn('white'), color: '#782F40' }}>Suscribirse</button>
      </div>
      <div style={s.pricingCard(false)}>
        <div style={s.badge('#3C5078')}>$5 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Discipulo</h3>
        <p style={{ ...s.p, fontSize: '0.85rem' }}>Reflexion diaria + 3 journals + historial</p>
        <button style={s.btn('#3C5078')}>Suscribirse</button>
      </div>
      <div style={s.pricingCard(false)}>
        <div style={s.badge('#782F40')}>$8 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Claraval</h3>
        <p style={{ ...s.p, fontSize: '0.85rem' }}>Todo: 9 journals + contenido futuro + acceso anticipado</p>
        <button style={s.btn('#782F40')}>Suscribirse</button>
      </div>
    </div>
  )
}

export default function Home() {
  const [vista, setVista] = useState('hoy')
  const [journalAbierto, setJournalAbierto] = useState(null)

  const tabs = [
    { id: 'hoy', label: 'Hoy' },
    { id: 'diarios', label: 'Diarios' },
    { id: 'precios', label: 'Planes' },
  ]

  return (
    <div style={s.app}>
      <header style={s.header}>
        <span style={s.logo}>Little Claraval</span>
        <UserMenu />
      </header>
      <nav style={s.nav}>
        {tabs.map(t => (
          <button key={t.id} style={s.navBtn(vista === t.id)} onClick={() => { setVista(t.id); setJournalAbierto(null) }}>
            {t.label}
          </button>
        ))}
      </nav>
      {vista === 'hoy' && <ViewHoy />}
      {vista === 'diarios' && !journalAbierto && <ViewDiarios onOpen={(j) => setJournalAbierto(j)} />}
      {vista === 'diarios' && journalAbierto && <ViewJournal journal={journalAbierto} onBack={() => setJournalAbierto(null)} />}
      {vista === 'precios' && <ViewPricing />}
    </div>
  )
}
