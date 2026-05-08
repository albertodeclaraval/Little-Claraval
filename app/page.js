'use client'
import { useState } from 'react'

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
  textarea: { width: '100%', minHeight: '200px', border: `1px solid #ddd`, borderRadius: '6px', padding: '1rem', fontSize: '0.95rem', lineHeight: 1.8, resize: 'vertical', fontFamily: 'Georgia, serif', boxSizing: 'border-box' },
  pricingCard: (highlight) => ({ backgroundColor: highlight ? colors.vino : 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', color: highlight ? 'white' : colors.texto }),
}

const journals = [
  { slug: 'examen', title: 'Examen del Día', days: 120 },
  { slug: 'paz', title: 'Paz Verdadera', days: 120 },
  { slug: 'fortaleza', title: 'Fortaleza', days: 120 },
  { slug: 'fiat', title: 'Fiat', days: 120 },
  { slug: 'verbum', title: 'Verbum', days: 120 },
  { slug: 'magnificat', title: 'Magnificat', days: 120 },
  { slug: 'confiteor', title: 'Confiteor', days: 120 },
  { slug: 'lumen', title: 'Lumen', days: 120 },
  { slug: 'miles', title: 'Miles Christi', days: 120 },
]

function ViewHoy() {
  return (
    <div style={s.content}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={s.badge(colors.verde)}>Tiempo Ordinario · Semana XIV</div>
        <p style={{ color: '#888', fontSize: '0.85rem' }}>Jueves 7 de mayo de 2026</p>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>✦ Evangelio del día</div>
        <h2 style={s.h1}>Mateo 10, 7-13</h2>
        <p style={s.p}>«Yendo, proclamad: El Reino de los Cielos está cerca. Curad enfermos, resucitad muertos, purificad leprosos, expulsad demonios. Gratis lo recibisteis, dadlo gratis.»</p>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>✦ Reflexión · Alberto De Claraval</div>
        <div style={{ ...s.badge(colors.vino), fontSize: '0.7rem' }}>PREMIUM · Nivel Peregrino</div>
        <p style={{ ...s.p, filter: 'blur(4px)', userSelect: 'none' }}>Jesús no manda a predicar con palabras vacías. Manda a predicar con obras que cuestan. Gratis recibiste la misericordia — gratis, es decir, sin merecerla. Ahora sal y dala. No hay tiempo para negociar los términos.</p>
        <button style={s.btn(colors.vino)}>Desbloquear reflexión · $3/mes</button>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>✦ Santo del día</div>
        <h2 style={{ ...s.h1, fontSize: '1.1rem' }}>San Augusto Chapdelaine</h2>
        <p style={s.p}>Mártir misionero en China. Testimonio de que el Evangelio vale más que la propia vida.</p>
        <p style={{ ...s.p, color: colors.verde, fontStyle: 'italic', marginTop: '0.75rem' }}>«Señor, que mi vida sea semilla.»</p>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>✦ Laudes · Oración de la mañana</div>
        <p style={s.p}>Oh Dios, que abres el día con tu luz, abre también mi corazón a tu presencia. Que nada de lo que haga hoy sea ajeno a Ti. Amén.</p>
      </div>
    </div>
  )
}

function ViewDiarios({ onOpen }) {
  return (
    <div style={s.content}>
      <h2 style={{ ...s.h1, marginBottom: '0.25rem' }}>Mis Diarios</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>120 días de encuentro diario con Dios</p>
      <div style={s.journalGrid}>
        {journals.map(j => (
          <div key={j.slug} style={s.journalCard} onClick={() => onOpen(j)}>
            <div style={{ fontSize: '0.7rem', color: colors.oro, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Día 1 / {j.days}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.texto }}>{j.title}</div>
            <div style={{ height: '4px', backgroundColor: '#f0e8d8', borderRadius: '2px', marginTop: '0.75rem' }}>
              <div style={{ height: '4px', width: '1%', backgroundColor: colors.oro, borderRadius: '2px' }} />
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
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: colors.vino, cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>← Volver</button>
      <div style={s.card}>
        <div style={s.cardTitle}>✦ {journal.title} · Día 1</div>
        <p style={{ ...s.p, fontStyle: 'italic', color: colors.verde, marginBottom: '1rem' }}>«Examíname, oh Dios, y conoce mi corazón.» — Sal 139, 23</p>
        <p style={{ ...s.p, marginBottom: '1rem' }}>Oración de apertura: Señor, aquí estoy. Quiero verte en este día que ya pasó. Dame ojos limpios para reconocerte.</p>
        <p style={{ fontWeight: 'bold', color: colors.texto, marginBottom: '0.5rem', fontSize: '0.9rem' }}>¿En qué momento del día sentiste más paz? ¿Por qué?</p>
        <textarea
          style={s.textarea}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Escribe aquí..."
        />
        <button style={s.btn(colors.vino)}>Guardar entrada</button>
      </div>
    </div>
  )
}

function ViewPricing() {
  return (
    <div style={s.content}>
      <h2 style={{ ...s.h1, marginBottom: '0.25rem' }}>Planes</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>El contenido litúrgico siempre es gratuito.</p>

      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.verde)}>Gratuito</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Peregrino Gratuito</h3>
        <p style={{ ...s.p, fontSize: '0.85rem' }}>Evangelio · Santo del día · Laudes · Vísperas · Rosario · Completas</p>
      </div>

      <div style={s.pricingCard(true)}>
        <div style={{ ...s.badge(colors.oro), color: colors.texto }}>$3 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Peregrino</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Reflexión diaria + 1 journal interactivo</p>
        <button style={{ ...s.btn('white'), color: colors.vino, marginTop: '1rem' }}>Suscribirse</button>
      </div>

      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.azul)}>$5 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Discípulo</h3>
        <p style={{ ...s.p, fontSize: '0.85rem' }}>Reflexión diaria + 3 journals + historial</p>
        <button style={s.btn(colors.azul)}>Suscribirse</button>
      </div>

      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.vino)}>$8 USD/mes</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Claraval</h3>
        <p style={{ ...s.p, fontSize: '0.85rem' }}>Todo: 9 journals + contenido futuro + acceso anticipado</p>
        <button style={s.btn(colors.vino)}>Suscribirse</button>
      </div>
    </div>
  )
}

export default function Home() {
  const [vista, setVista] = useState('hoy')
  const [journalAbierto, setJournalAbierto] = useState(null)

  const tabs = [
    { id: 'hoy', label: '🕊 Hoy' },
    { id: 'diarios', label: '📖 Diarios' },
    { id: 'precios', label: '✦ Planes' },
  ]

  return (
    <div style={s.app}>
      <header style={s.header}>
        <span style={s.logo}>✝ Little Claraval</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Via Claraval</span>
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