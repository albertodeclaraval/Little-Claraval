'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { fetchDailyReadings, fetchLiturgicalDay } from './lib/liturgical-api'
import { fetchSaint, fetchDayReflection, fetchLiturgyHour, fetchRosary, fetchChaplet, fetchAppLinks, fetchDayReadings, getJournalDay, getJournalEntries, saveJournalEntries } from './lib/content'

var supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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

// ── Translation tables ──────────────────────────────────────────────────────
var T = {
  es: {
    today: 'Hoy', journals: 'Diarios', plans: 'Planes', redeem: 'Canjear',
    loading: 'Cargando...', comingSoon: 'Próximamente',
    readingsOfDay: 'Lecturas del Día',
    noReadings: 'No se pudieron cargar las lecturas. Verifica tu conexión.',
    fullTextSoon: 'Texto completo próximamente',
    firstReading: 'Primera Lectura', psalm: 'Salmo',
    secondReading: 'Segunda Lectura', gospel: 'Evangelio',
    reflectionTitle: 'Reflexión — Alberto de Claraval',
    reflectionInPrep: 'Reflexión en preparación...',
    premiumBadge: 'PREMIUM — Nivel Peregrino', unlockBtn: 'Desbloquear — $1.700 CLP/mes (~US$2)',
    reflectionPreview: 'El silencio es el umbral de la contemplación. En él, Dios habla al corazón sin palabras. Detente un momento antes de comenzar el día y deja que la Palabra resuene en ti.',
    saintOfDay: 'Santo del Día', noInfo: 'Información no disponible',
    patronOf: 'Patrono/a de:', canonizedIn: 'Canonizado en', canonizedBy: ' por ',
    prayerLabel: 'Oración',
    liturgyHours: 'Liturgia de las Horas',
    lauds: 'Laudes', morningPrayer: 'Oración de la mañana',
    vespers: 'Vísperas', afternoonPrayer: 'Oración de la tarde',
    compline: 'Completas', nightPrayer: 'Oración de la noche',
    rosaryOfDay: 'Rosario del Día', chapletTitle: 'Coronilla de la Divina Misericordia',
    howToPrayRosary: 'Cómo rezar el Rosario',
    mysteries5: 'Los 5 Misterios', fruit: 'Fruto:',
    viewFullPrayers: 'Ver oraciones completas',
    howToPrayChaplet: 'Cómo rezarla',
    openingPrayers: 'Oraciones Iniciales',
    largeBead: 'En las cuentas grandes', smallBead: 'En las cuentas pequeñas',
    repeatThrice: '(repetir 3 veces)',
    myJournals: 'Mis Diarios', journalSubtitle: 'Diarios de oración y examen',
    locked: 'Bloqueado', dayLabel: 'Día', weekLabel: 'Semana',
    patronSaint: 'Santo Patrono',
    save: 'Guardar entrada', saving: 'Guardando...', saved: 'Guardado ✓',
    writeHere: 'Escribe aqui...', back: 'Volver',
    prev: '← Anterior', next: 'Siguiente →',
    aboutJournal: 'ℹ️ Sobre este diario',
    planSubtitle: 'El contenido liturgico siempre es gratuito.',
    freeBadge: 'Gratuito', freePlanName: 'Cuenta Gratuita',
    freeDesc: 'Evangelio - Santo del dia - Laudes - Liturgia de las Horas - Rosario - Coronilla',
    currentPlan: 'Tu plan actual', included: 'Incluido', subscribe: 'Suscribirse',
    redeemPageTitle: 'Canjear codigo',
    redeemPageDesc: 'Si tienes un codigo promocional o de un journal fisico, ingresalo aqui.',
    redeemBtn: 'Canjear', redeeming: 'Canjeando...', signOut: 'Salir',
    signInBtn: 'Sign In / Sign Up', signInToRead: 'Inicia sesión para leer la reflexión', subscribeToRead: 'Suscríbete para leer la reflexión diaria',
    rosarySteps: [
      'Señal de la Cruz', 'Credo',
      '1 Padrenuestro + 3 Ave Marías + Gloria',
      'Anunciar cada misterio — 1 Padrenuestro + 10 Ave Marías + Gloria + Oración de Fátima',
      'Salve + Oración final',
    ],
    prayerLabels: {
      sign_of_cross: 'Señal de la Cruz', apostles_creed: 'Credo',
      our_father: 'Padrenuestro', hail_mary: 'Ave María',
      glory_be: 'Gloria', fatima_prayer: 'Oración de Fátima',
      hail_holy_queen: 'Salve', final_prayer: 'Oración Final',
    },
    coronillaItems: [
      { key: 'sign_of_cross', label: 'Señal de la Cruz' },
      { key: 'opening_prayer', label: 'Oración Inicial' },
      { key: 'our_father', label: 'Padrenuestro' },
      { key: 'hail_mary', label: 'Ave María' },
      { key: 'apostles_creed', label: 'Credo' },
    ],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesLong: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    goToToday: 'Hoy',
    catalogTab: 'Catálogo',
    catalogTitle: 'Obtén tus diarios',
    catalogSubtitle: 'Diarios de oración y examen para cada camino. Disponibles con un plan.',
    getIt: 'Obtener con un plan',
    includedInPlan: 'Incluido en tu plan',
    audienceLabels: { hombres: 'Para hombres', mujeres: 'Para mujeres', todos: 'Para todos' },
  },
  en: {
    today: 'Today', journals: 'Journals', plans: 'Plans', redeem: 'Redeem',
    loading: 'Loading...', comingSoon: 'Coming soon',
    readingsOfDay: 'Daily Readings',
    noReadings: 'Could not load readings. Check your connection.',
    fullTextSoon: 'Full text coming soon',
    firstReading: 'First Reading', psalm: 'Psalm',
    secondReading: 'Second Reading', gospel: 'Gospel',
    reflectionTitle: 'Reflection — Alberto de Claraval',
    reflectionInPrep: 'Reflection in preparation...',
    premiumBadge: 'PREMIUM — Peregrino Level', unlockBtn: 'Unlock — CLP $1,700/mo (~US$2)',
    reflectionPreview: 'Silence is the threshold of contemplation. In it, God speaks to the heart without words. Pause a moment before beginning the day and let the Word resonate within you.',
    saintOfDay: 'Saint of the Day', noInfo: 'Information not available',
    patronOf: 'Patron of:', canonizedIn: 'Canonized in', canonizedBy: ' by ',
    prayerLabel: 'Prayer',
    liturgyHours: 'Liturgy of the Hours',
    lauds: 'Lauds', morningPrayer: 'Morning prayer',
    vespers: 'Vespers', afternoonPrayer: 'Evening prayer',
    compline: 'Compline', nightPrayer: 'Night prayer',
    rosaryOfDay: 'Rosary of the Day', chapletTitle: 'Divine Mercy Chaplet',
    howToPrayRosary: 'How to pray the Rosary',
    mysteries5: 'The 5 Mysteries', fruit: 'Fruit:',
    viewFullPrayers: 'View full prayers',
    howToPrayChaplet: 'How to pray it',
    openingPrayers: 'Opening Prayers',
    largeBead: 'On large beads', smallBead: 'On small beads',
    repeatThrice: '(repeat 3 times)',
    myJournals: 'My Journals', journalSubtitle: 'Prayer and examination journals',
    locked: 'Locked', dayLabel: 'Day', weekLabel: 'Week',
    patronSaint: 'Patron Saint',
    save: 'Save entry', saving: 'Saving...', saved: 'Saved ✓',
    writeHere: 'Write here...', back: 'Back',
    prev: '← Previous', next: 'Next →',
    aboutJournal: 'ℹ️ About this journal',
    planSubtitle: 'Liturgical content is always free.',
    freeBadge: 'Free', freePlanName: 'Free Account',
    freeDesc: 'Gospel - Saint of the day - Lauds - Liturgy of the Hours - Rosary - Chaplet',
    currentPlan: 'Your current plan', included: 'Included', subscribe: 'Subscribe',
    redeemPageTitle: 'Redeem code',
    redeemPageDesc: 'If you have a promotional code or from a physical journal, enter it here.',
    redeemBtn: 'Redeem', redeeming: 'Redeeming...', signOut: 'Sign out',
    signInBtn: 'Sign In / Sign Up', signInToRead: 'Sign in to read the reflection', subscribeToRead: 'Subscribe to read the daily reflection',
    rosarySteps: [
      'Sign of the Cross', "Apostles' Creed",
      '1 Our Father + 3 Hail Marys + Glory Be',
      'Announce each mystery — 1 Our Father + 10 Hail Marys + Glory Be + Fatima Prayer',
      'Hail Holy Queen + Final Prayer',
    ],
    prayerLabels: {
      sign_of_cross: 'Sign of the Cross', apostles_creed: "Apostles' Creed",
      our_father: 'Our Father', hail_mary: 'Hail Mary',
      glory_be: 'Glory Be', fatima_prayer: 'Fatima Prayer',
      hail_holy_queen: 'Hail Holy Queen', final_prayer: 'Final Prayer',
    },
    coronillaItems: [
      { key: 'sign_of_cross', label: 'Sign of the Cross' },
      { key: 'opening_prayer', label: 'Opening Prayer' },
      { key: 'our_father', label: 'Our Father' },
      { key: 'hail_mary', label: 'Hail Mary' },
      { key: 'apostles_creed', label: "Apostles' Creed" },
    ],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesLong: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    goToToday: 'Today',
    catalogTab: 'Catalog',
    catalogTitle: 'Get Your Journals',
    catalogSubtitle: 'Prayer and examination journals for every path. Available with a plan.',
    getIt: 'Get it with a plan',
    includedInPlan: 'Included in your plan',
    audienceLabels: { hombres: 'For men', mujeres: 'For women', todos: 'For everyone' },
  },
}

// ── Journal helpers ─────────────────────────────────────────────────────────
function lsJournalKey(slug, unit, lang) { return 'journal_' + slug + '_' + unit + '_' + lang }
function lsJournalLoad(slug, unit, lang) {
  try { return JSON.parse(localStorage.getItem(lsJournalKey(slug, unit, lang)) || '{}') } catch(e) { return {} }
}
function lsJournalSave(slug, unit, lang, answers) {
  try { localStorage.setItem(lsJournalKey(slug, unit, lang), JSON.stringify(answers)) } catch(e) {}
}

var JOURNALS = [
  { slug: 'EXAMEN_DEL_DIA', title: 'Examen del Dia', titleEn: 'Daily Examen', type: 'daily', total: 120, questionsPerUnit: 3 },
  { slug: 'PAZ_VERDADERA', title: 'Paz Verdadera', titleEn: 'True Peace', type: 'daily', total: 120, questionsPerUnit: 3 },
  { slug: 'FORTALEZA', title: 'Fortaleza', titleEn: 'Fortitude', type: 'daily', total: 120, questionsPerUnit: 3 },
  { slug: 'FIAT', title: 'Fiat', titleEn: 'Fiat', type: 'daily', total: 120, questionsPerUnit: 3 },
  { slug: 'VERBUM', title: 'Verbum', titleEn: 'Verbum', type: 'daily', total: 120, questionsPerUnit: 3 },
  { slug: 'MAGNIFICAT', title: 'Magnificat', titleEn: 'Magnificat', type: 'daily', total: 120, questionsPerUnit: 3 },
  { slug: 'CONFITEOR', title: 'Confiteor', titleEn: 'Confiteor', type: 'weekly', total: 52, questionsPerUnit: 3 },
  { slug: 'LUMEN', title: 'Lumen', titleEn: 'Lumen', type: 'weekly', total: 52, questionsPerUnit: 3, hasPatronSaint: true },
  { slug: 'MILES_CHRISTI', title: 'Miles Christi', titleEn: 'Miles Christi', type: 'daily', total: 90, questionsPerUnit: 6 },
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

var SEASON_EN = {
  easter: 'Easter Season', christmas: 'Christmas',
  advent: 'Advent', lent: 'Lent',
  'ordinary time': 'Ordinary Time', ordinary: 'Ordinary Time',
  pentecost: 'Pentecost'
}

var CELEBRATION_TYPE_ES = {
  'SUNDAY': 'Domingo', 'MONDAY': 'Lunes', 'TUESDAY': 'Martes',
  'WEDNESDAY': 'Miércoles', 'THURSDAY': 'Jueves', 'FRIDAY': 'Viernes',
  'SATURDAY': 'Sábado', 'FEAST': 'Fiesta', 'FEAST OF THE LORD': 'Fiesta del Señor',
  'MEMORIAL': 'Memoria', 'OPTIONAL MEMORIAL': 'Memoria Opcional',
  'OPTIONAL_MEMORIAL': 'Memoria Opcional', 'SOLEMNITY': 'Solemnidad', 'FERIA': 'Feria'
}

var CELEBRATION_TYPE_EN = {
  'SUNDAY': 'Sunday', 'MONDAY': 'Monday', 'TUESDAY': 'Tuesday',
  'WEDNESDAY': 'Wednesday', 'THURSDAY': 'Thursday', 'FRIDAY': 'Friday',
  'SATURDAY': 'Saturday', 'FEAST': 'Feast', 'FEAST OF THE LORD': 'Feast of the Lord',
  'MEMORIAL': 'Memorial', 'OPTIONAL MEMORIAL': 'Optional Memorial',
  'OPTIONAL_MEMORIAL': 'Optional Memorial', 'SOLEMNITY': 'Solemnity', 'FERIA': 'Feria'
}

function translateCelebration(type, lang) {
  if (!type) return ''
  var map = lang === 'en' ? CELEBRATION_TYPE_EN : CELEBRATION_TYPE_ES
  return map[type.toUpperCase()] || type
}

var ROSARY_NAMES = {
  0: 'Misterios Gloriosos', 1: 'Misterios Gozosos',
  2: 'Misterios Dolorosos', 3: 'Misterios Gloriosos',
  4: 'Misterios Luminosos', 5: 'Misterios Dolorosos',
  6: 'Misterios Gozosos'
}

var ROSARY_NAMES_EN = {
  0: 'Glorious Mysteries', 1: 'Joyful Mysteries',
  2: 'Sorrowful Mysteries', 3: 'Glorious Mysteries',
  4: 'Luminous Mysteries', 5: 'Sorrowful Mysteries',
  6: 'Joyful Mysteries'
}

var ROSARY_NAMES_LATIN = {
  0: 'Mysteria Gloriosa', 1: 'Mysteria Gaudiosa',
  2: 'Mysteria Dolorosa', 3: 'Mysteria Gloriosa',
  4: 'Mysteria Luminosa', 5: 'Mysteria Dolorosa',
  6: 'Mysteria Gaudiosa'
}

function getSeasonColor(season) {
  if (!season) return colors.verde
  var s = season.toLowerCase()
  for (var key in SEASON_COLORS) {
    if (s.includes(key)) return SEASON_COLORS[key]
  }
  return colors.verde
}

function getSeasonLabel(season, lang) {
  if (!season) return lang === 'en' ? 'Ordinary Time' : 'Tiempo Ordinario'
  var s = season.toLowerCase()
  var map = lang === 'en' ? SEASON_EN : SEASON_ES
  for (var key in map) {
    if (s.includes(key)) return map[key]
  }
  return season
}

var MYSTERY_CIRCLES = ['①', '②', '③', '④', '⑤']

function toDateStr(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

// ── Base UI components ──────────────────────────────────────────────────────
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

function Proximamente({ t }) {
  return <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>{t.comingSoon}</p>
}

// ── Shared prayer styles ─────────────────────────────────────────────────────
var prayerSectionHeader = { fontSize: '0.78rem', fontWeight: 'bold', color: '#782F40', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }
var prayerBodyText = { lineHeight: 1.8, fontSize: '0.9rem', color: '#444', margin: '0 0 0.3rem' }
var prayerLatinText = { fontStyle: 'italic', color: '#aaa', fontSize: '0.85rem', margin: 0 }
var prayerLabel = { fontSize: '0.72rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.2rem' }
var prayerDivider = { borderTop: '1px solid #e8dcc8', margin: '0.9rem 0' }

// ── Coronilla ────────────────────────────────────────────────────────────────
function CoronillaContent({ chaplet, t }) {
  var [showInstructions, setShowInstructions] = useState(false)
  var c = chaplet && chaplet.content
  if (!c || typeof c !== 'object') {
    return <p style={prayerBodyText}>{String(c || '')}</p>
  }
  return (
    <div>
      {c.title && <h3 style={{ fontSize: '1rem', color: '#2C1810', margin: '0 0 0.4rem', fontWeight: 'bold' }}>{c.title}</h3>}
      {c.introduction && <p style={{ lineHeight: 1.75, fontSize: '0.88rem', color: '#777', fontStyle: 'italic', margin: '0 0 0.9rem' }}>{c.introduction}</p>}

      {c.opening_prayers && (
        <>
          <div style={prayerDivider} />
          <p style={prayerSectionHeader}>{t.openingPrayers}</p>
          {t.coronillaItems.map(function(item) {
            var text = c.opening_prayers[item.key]
            if (!text) return null
            return (
              <div key={item.key} style={{ marginBottom: '0.7rem' }}>
                <p style={prayerLabel}>{item.label}</p>
                <p style={prayerBodyText}>{text}</p>
              </div>
            )
          })}
        </>
      )}

      {c.eternal_father && (
        <>
          <div style={prayerDivider} />
          <p style={prayerSectionHeader}>{t.largeBead}</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.1rem', color: '#782F40', flexShrink: 0, lineHeight: 1.65 }}>●</span>
            <p style={prayerBodyText}>{c.eternal_father}</p>
          </div>
        </>
      )}

      {c.small_bead && (
        <>
          <div style={prayerDivider} />
          <p style={prayerSectionHeader}>{t.smallBead}</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#3C5078', flexShrink: 0, lineHeight: 2.6, letterSpacing: '0.15em' }}>○○○</span>
            <p style={prayerBodyText}>{c.small_bead}</p>
          </div>
        </>
      )}

      {c.closing && (
        <>
          <div style={prayerDivider} />
          {c.closing.holy_god && (
            <div style={{ marginBottom: '0.9rem' }}>
              <p style={prayerSectionHeader}>
                Al finalizar{' '}
                <span style={{ fontStyle: 'italic', textTransform: 'none', fontWeight: 'normal', letterSpacing: 0 }}>
                  {t.repeatThrice}
                </span>
              </p>
              <p style={prayerBodyText}>{c.closing.holy_god}</p>
            </div>
          )}
          {c.closing.final_prayer && (
            <div>
              <p style={prayerSectionHeader}>{t.prayerLabels.final_prayer}</p>
              <p style={prayerBodyText}>{c.closing.final_prayer}</p>
            </div>
          )}
        </>
      )}

      {c.instructions && c.instructions.steps && (
        <>
          <div style={prayerDivider} />
          <button
            onClick={function() { setShowInstructions(function(v) { return !v }) }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#4B643C', fontSize: '0.82rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>{showInstructions ? '▾' : '▸'}</span>
            <span>{t.howToPrayChaplet}</span>
          </button>
          {showInstructions && (
            <ol style={{ margin: '0.6rem 0 0', paddingLeft: '1.3rem' }}>
              {c.instructions.steps.map(function(step, i) {
                return <li key={i} style={{ fontSize: '0.86rem', color: '#555', lineHeight: 1.7, marginBottom: '0.3rem' }}>{step}</li>
              })}
            </ol>
          )}
        </>
      )}
    </div>
  )
}

// ── Rosario prayers (hardcoded — universal fixed prayers) ────────────────────
var rosaryPrayers = {
  actoContricion: {
    label: { es: 'Acto de Contrición', en: 'Act of Contrition' },
    es: 'Jesús, mi Señor y Redentor, yo me arrepiento de todos los pecados que he cometido hasta hoy, y me pesa de todo corazón, porque con ellos he ofendido a un Dios tan bueno. Propongo firmemente no volver a pecar y confío que por tu infinita misericordia me has de conceder el perdón de mis culpas y me has de llevar a la vida eterna. Amén.',
    en: 'Jesus, my Lord and Redeemer, I repent of all the sins I have committed up to this day, and I am sorry for them with all my heart, because by them I have offended a God so good. I firmly resolve never to sin again, and I trust that, through your infinite mercy, you will grant me the forgiveness of my sins and lead me to eternal life. Amen.',
  },
  gloria: {
    label: { es: 'Gloria', en: 'Glory Be' },
    es: 'Gloria al Padre, al Hijo y al Espíritu Santo. Como era en un principio, ahora y siempre, por los siglos de los siglos. Amén.',
    en: 'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.',
  },
  fatima: {
    label: { es: 'Oración de Fátima', en: 'Fatima Prayer' },
    es: '¡Oh Jesús mío!, perdona nuestros pecados, líbranos del fuego del infierno, lleva todas las almas al cielo y socorre especialmente a las más necesitadas de tu misericordia.',
    en: 'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy.',
    la: 'O mi Iesu, dimitte nobis debita nostra, salva nos ab igne inferni, perduc in caelum omnes animas, praesertim illas quae maxime indigent misericordia tua.',
  },
  salveRegina: {
    label: { es: 'Salve Regina', en: 'Hail Holy Queen' },
    es: 'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra: Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos y, después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clementísima! ¡oh piadosa! ¡oh dulce Virgen María!\nV. Ruega por nosotros, santa Madre de Dios.\nR. Para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo. Amén.',
    en: 'Hail, holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious Advocate, thine eyes of mercy toward us; and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ. Amen.',
    la: 'Salve, Regina, Mater misericordiae, vita, dulcedo et spes nostra, salve. Ad te clamamus, exsules filii Hevae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle. Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende. O clemens, o pia, o dulcis Virgo Maria.\nV. Ora pro nobis, sancta Dei Genetrix.\nR. Ut digni efficiamur promissionibus Christi. Amen.',
  },
  sanMiguel: {
    label: { es: 'San Miguel Arcángel', en: 'St. Michael the Archangel' },
    es: 'San Miguel Arcángel, defiéndenos en la batalla. Sé nuestro amparo contra las perversidades y asechanzas del demonio. Reprímale Dios, pedimos suplicantes, y tú, príncipe de la milicia celestial, arroja al infierno con el divino poder a Satanás y a los otros espíritus malignos que andan dispersos por el mundo para la perdición de las almas. Amén.',
    en: 'Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.',
    la: 'Sancte Michaël Archangele, defende nos in proelio; contra nequitiam et insidias diaboli esto praesidium. Imperet illi Deus, supplices deprecamur: tuque, Princeps militiae caelestis, Satanam aliosque spiritus malignos, qui ad perditionem animarum pervagantur in mundo, divina virtute in infernum detrude. Amen.',
  },
  dulceMadre: {
    label: { es: 'Dulce Madre', en: 'Sweet Mother' },
    es: 'Dulce Madre, no te alejes, tu vista de nosotros no apartes. Ven con nosotros a todas partes y solos nunca nos dejes. Y ya que nos amas tanto, verdadera Madre que eres, haz que nos bendiga el Padre, el Hijo y el Espíritu Santo. Amén.',
    en: 'Sweet Mother, do not go far from us; turn not your gaze away from us. Come with us wherever we go, and never leave us alone. And since you love us so, true Mother that you are, obtain for us the blessing of the Father, and of the Son, and of the Holy Spirit. Amen.',
  },
}

// ── Rosario ──────────────────────────────────────────────────────────────────
function RosarioContent({ rosary, weekday, t, lang }) {
  var [showInstructions, setShowInstructions] = useState(false)
  var [showPrayers, setShowPrayers] = useState(false)

  if (!rosary) return <Proximamente t={t} />

  var mysteries = rosary.mysteries
  var prayers = rosary.prayers
  var nameMap = lang === 'en' ? ROSARY_NAMES_EN : ROSARY_NAMES
  var setName = nameMap[weekday] || 'Rosario'
  var setNameLatin = ROSARY_NAMES_LATIN[weekday] || ''

  return (
    <div>
      <h3 style={{ fontSize: '1rem', color: '#2C1810', margin: '0 0 0.2rem', fontWeight: 'bold' }}>{setName}</h3>
      {setNameLatin && <p style={{ fontStyle: 'italic', color: '#aaa', fontSize: '0.83rem', margin: '0 0 0.9rem' }}>{setNameLatin}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={function() { setShowInstructions(function(v) { return !v }) }}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#4B643C', fontSize: '0.82rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <span>{showInstructions ? '▾' : '▸'}</span>
          <span>{t.howToPrayRosary}</span>
        </button>
        {showInstructions && (
          <ol style={{ margin: '0.6rem 0 0', paddingLeft: '1.3rem', backgroundColor: '#fdf8f0', borderRadius: '6px', padding: '0.7rem 0.7rem 0.7rem 2rem' }}>
            {t.rosarySteps.map(function(step, i) {
              return <li key={i} style={{ fontSize: '0.86rem', color: '#555', lineHeight: 1.7, marginBottom: '0.3rem' }}>{step}</li>
            })}
          </ol>
        )}
      </div>

      <div style={{ marginBottom: '1.2rem', paddingBottom: '1.2rem', borderBottom: '1px solid #ede5d4' }}>
        <p style={prayerSectionHeader}>{rosaryPrayers.actoContricion.label[lang] || rosaryPrayers.actoContricion.label.es}</p>
        <p style={prayerBodyText}>{rosaryPrayers.actoContricion[lang] || rosaryPrayers.actoContricion.es}</p>
      </div>

      {mysteries && Array.isArray(mysteries) && mysteries.length > 0 && (
        <div>
          <p style={prayerSectionHeader}>{t.mysteries5}</p>
          {mysteries.map(function(m, i) {
            var circle = MYSTERY_CIRCLES[i] || String(i + 1)
            return (
              <div key={i} style={{ marginBottom: '1.1rem', paddingBottom: '1.1rem', borderBottom: i < mysteries.length - 1 ? '1px solid #ede5d4' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '1.05rem', color: '#782F40', flexShrink: 0, fontWeight: 'bold', lineHeight: 1.4 }}>{circle}</span>
                  <div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 'bold', color: '#2C1810' }}>{m.title}</span>
                    {m.title_latin && <span style={{ display: 'block', fontStyle: 'italic', color: '#bbb', fontSize: '0.8rem' }}>{m.title_latin}</span>}
                  </div>
                </div>
                {m.scripture && (
                  <p style={{ fontSize: '0.76rem', color: '#bbb', margin: '0.2rem 0 0.45rem 1.6rem' }}>{m.scripture}</p>
                )}
                {m.meditation && (
                  <p style={{ lineHeight: 1.8, fontSize: '0.88rem', color: '#444', margin: '0 0 0.45rem 1.6rem' }}>{m.meditation}</p>
                )}
                {m.fruit && (
                  <p style={{ fontSize: '0.8rem', margin: '0 0 0 1.6rem' }}>
                    <span style={{ color: '#bbb', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.fruit} </span>
                    <span style={{ fontStyle: 'italic', color: '#666' }}>{m.fruit}</span>
                    {m.fruit_latin && <span style={{ fontStyle: 'italic', color: '#bbb', fontSize: '0.78rem' }}> / {m.fruit_latin}</span>}
                  </p>
                )}
                <div style={{ margin: '0.65rem 0 0 1.6rem', paddingTop: '0.55rem', borderTop: '1px dotted #e8dcc8' }}>
                  <p style={prayerSectionHeader}>{rosaryPrayers.gloria.label[lang] || rosaryPrayers.gloria.label.es}</p>
                  <p style={{ ...prayerBodyText, margin: '0 0 0.7rem' }}>{rosaryPrayers.gloria[lang] || rosaryPrayers.gloria.es}</p>
                  <p style={prayerSectionHeader}>{rosaryPrayers.fatima.label[lang] || rosaryPrayers.fatima.label.es}</p>
                  <p style={{ ...prayerBodyText, margin: '0 0 0.4rem' }}>{rosaryPrayers.fatima[lang] || rosaryPrayers.fatima.es}</p>
                  <p style={prayerLabel}>Latín</p>
                  <p style={prayerLatinText}>{rosaryPrayers.fatima.la}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ borderTop: '1px solid #e8dcc8', paddingTop: '0.85rem', marginBottom: '1rem' }}>
        {[
          { key: 'salveRegina', hasLatin: true },
          { key: 'sanMiguel', hasLatin: true },
          { key: 'dulceMadre', hasLatin: false },
        ].map(function(item) {
          var p = rosaryPrayers[item.key]
          return (
            <div key={item.key} style={{ marginBottom: '1.1rem', paddingBottom: '1.1rem', borderBottom: '1px solid #ede5d4' }}>
              <p style={prayerSectionHeader}>{p.label[lang] || p.label.es}</p>
              <p style={{ ...prayerBodyText, whiteSpace: 'pre-line', margin: '0 0 0.4rem' }}>{p[lang] || p.es}</p>
              {item.hasLatin && (
                <>
                  <p style={prayerLabel}>Latín</p>
                  <p style={{ ...prayerLatinText, whiteSpace: 'pre-line' }}>{p.la}</p>
                </>
              )}
            </div>
          )
        })}
      </div>

      {prayers && typeof prayers === 'object' && (
        <div style={{ borderTop: '1px solid #e8dcc8', paddingTop: '0.75rem' }}>
          <button
            onClick={function() { setShowPrayers(function(v) { return !v }) }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#4B643C', fontSize: '0.82rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>{showPrayers ? '▾' : '▸'}</span>
            <span>{t.viewFullPrayers}</span>
          </button>
          {showPrayers && (
            <div style={{ marginTop: '0.75rem' }}>
              {Object.keys(prayers).map(function(key) {
                var val = prayers[key]
                if (!val) return null
                var label = t.prayerLabels[key] || key
                var vernacular = typeof val === 'string' ? val : val.vernacular
                var latin = typeof val === 'object' ? val.latin : null
                return (
                  <div key={key} style={{ marginBottom: '0.9rem', paddingBottom: '0.9rem', borderBottom: '1px solid #ede5d4' }}>
                    <p style={prayerSectionHeader}>{label}</p>
                    {vernacular && <p style={prayerBodyText}>{vernacular}</p>}
                    {latin && <p style={prayerLatinText}>{latin}</p>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── ViewHoy ──────────────────────────────────────────────────────────────────
function ViewHoy({ tier, user, onSwitchView, lang, selectedDate, onDateChange }) {
  var t = T[lang] || T.es
  var canReflection = (TIER_LEVELS[tier] || 0) >= 1

  var today = selectedDate
  var dateStr = toDateStr(today)
  var mo = String(today.getMonth() + 1).padStart(2, '0')
  var dy = String(today.getDate()).padStart(2, '0')
  var monthDay = mo + '-' + dy
  var weekday = today.getDay()
  var hour = new Date().getHours()  // always real current hour for liturgy highlighting

  var [readings, setReadings] = useState(null)
  var [litDay, setLitDay] = useState(null)
  var [saint, setSaint] = useState(null)
  var [reflection, setReflection] = useState(null)
  var [lh, setLh] = useState({ laudes: null, visperas: null, completas: null })
  var [rosary, setRosary] = useState(null)
  var [chaplet, setChaplet] = useState(null)
  var [appLinks, setAppLinks] = useState([])
  var [supabaseReadings, setSupabaseReadings] = useState(null)
  var [loading, setLoading] = useState(true)
  var [open, setOpen] = useState({
    lecturas: false, primera: false, salmo: false, segunda: false, evangelio: false,
    reflexion: false, santo: false, liturgia: false, laudes: false,
    visperas: false, completas: false, rosario: false, coronilla: false
  })

  useEffect(function() {
    var cancelled = false
    setLoading(true)
    Promise.all([
      fetchDailyReadings(today),
      fetchLiturgicalDay(today),
      fetchSaint(monthDay),
      fetchDayReflection(dateStr, lang),
      fetchLiturgyHour('lauds', 1, weekday, 'ordinary', lang),
      fetchLiturgyHour('vespers', 1, weekday, 'ordinary', lang),
      fetchLiturgyHour('compline', 1, weekday, 'ordinary', lang),
      fetchRosary(weekday, lang),
      fetchChaplet(lang),
      fetchAppLinks(),
      fetchDayReadings(dateStr, lang)
    ]).then(function(r) {
      if (cancelled) return
      setReadings(r[0])
      setLitDay(r[1])
      setSaint(r[2])
      setReflection(r[3])
      setLh({ laudes: r[4], visperas: r[5], completas: r[6] })
      setRosary(r[7])
      setChaplet(r[8])
      setAppLinks(r[9] || [])
      setSupabaseReadings(r[10])
      setLoading(false)
    })
    return function() { cancelled = true }
  }, [lang, dateStr])

  function toggle(key) {
    setOpen(function(prev) { return Object.assign({}, prev, { [key]: !prev[key] }) })
  }

  var season = (readings && readings.season) || (litDay && litDay.season) || ''
  var seasonColor = getSeasonColor(season)
  var seasonLabel = getSeasonLabel(season, lang)
  var celebration = litDay && litDay.celebration
  var rd = readings && readings.readings

  var mergedFirst  = { ref: (supabaseReadings && supabaseReadings.first_reading_ref)  || (rd && rd.firstReading),   text: supabaseReadings && supabaseReadings.first_reading_text }
  var mergedPsalm  = { ref: (supabaseReadings && supabaseReadings.psalm_ref)           || (rd && rd.psalm),          text: supabaseReadings && supabaseReadings.psalm_text }
  var mergedSecond = { ref: (supabaseReadings && supabaseReadings.second_reading_ref)  || (rd && rd.secondReading),  text: supabaseReadings && supabaseReadings.second_reading_text }
  var mergedGospel = { ref: (supabaseReadings && supabaseReadings.gospel_ref)          || (rd && rd.gospel),         text: supabaseReadings && supabaseReadings.gospel_text }

  // Saint fields: prefer lang-specific, fall back to ES
  var saintName = saint
    ? (lang === 'en' ? (saint.name_en || saint.name_es) : saint.name_es)
    : (celebration && celebration.name)
  var saintBio = saint
    ? (lang === 'en' ? (saint.bio_en || saint.bio_es) : saint.bio_es)
    : (celebration && celebration.description)
  var saintPrayer = saint ? (lang === 'en' ? (saint.prayer_en || saint.prayer_es) : saint.prayer_es) : null
  var saintPatronage = saint ? (lang === 'en' ? (saint.patronage_en || saint.patronage_es) : saint.patronage_es) : null
  var saintFeastDay = saint ? (lang === 'en' ? (saint.feast_day_en || saint.feast_day_es) : saint.feast_day_es) : null

  if (loading) {
    return <div style={Object.assign({}, s.content, { textAlign: 'center', color: '#aaa', paddingTop: '3rem' })}>{t.loading}</div>
  }

  return (
    <div style={s.content}>

      {/* Navegación por fecha */}
      <DateNav date={selectedDate} onChange={onDateChange} lang={lang} t={t} />

      {/* Encabezado litúrgico */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={s.badge(seasonColor)}>{seasonLabel}</div>
        {celebration && celebration.type && (
          <div style={{ fontSize: '0.72rem', color: '#999', marginTop: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {translateCelebration(celebration.type, lang)}
          </div>
        )}
      </div>

      {/* A) Lecturas del día */}
      <div style={Object.assign({}, s.card, { borderLeft: '3px solid ' + seasonColor })}>
        <div
          onClick={function() { toggle('lecturas') }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: open.lecturas ? '0.25rem' : 0 }}
        >
          <div style={s.cardTitle}>{t.readingsOfDay}</div>
          <span style={{ color: colors.vino, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{open.lecturas ? '▾' : '▸'}</span>
        </div>
        {open.lecturas && (!mergedFirst.ref && !mergedPsalm.ref && !mergedGospel.ref ? (
          <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>{t.noReadings}</p>
        ) : (
          <>
            {mergedFirst.ref && (
              <Accordion title={t.firstReading + ' — ' + mergedFirst.ref} isOpen={open.primera} onToggle={function() { toggle('primera') }}>
                {mergedFirst.text
                  ? <p style={{ lineHeight: 1.85, fontSize: '0.95rem', color: '#3a3a3a', whiteSpace: 'pre-wrap' }}>{mergedFirst.text}</p>
                  : <p style={{ fontSize: '0.78rem', color: '#bbb', fontStyle: 'italic' }}>{t.fullTextSoon}</p>}
              </Accordion>
            )}
            {mergedPsalm.ref && (
              <Accordion title={t.psalm + ' — ' + mergedPsalm.ref} isOpen={open.salmo} onToggle={function() { toggle('salmo') }}>
                {mergedPsalm.text
                  ? <p style={{ lineHeight: 1.85, fontSize: '0.95rem', color: '#3a3a3a', whiteSpace: 'pre-wrap' }}>{mergedPsalm.text}</p>
                  : <p style={{ fontSize: '0.78rem', color: '#bbb', fontStyle: 'italic' }}>{t.fullTextSoon}</p>}
              </Accordion>
            )}
            {mergedSecond.ref && (
              <Accordion title={t.secondReading + ' — ' + mergedSecond.ref} isOpen={open.segunda} onToggle={function() { toggle('segunda') }}>
                {mergedSecond.text
                  ? <p style={{ lineHeight: 1.85, fontSize: '0.95rem', color: '#3a3a3a', whiteSpace: 'pre-wrap' }}>{mergedSecond.text}</p>
                  : <p style={{ fontSize: '0.78rem', color: '#bbb', fontStyle: 'italic' }}>{t.fullTextSoon}</p>}
              </Accordion>
            )}
            {mergedGospel.ref && (
              <Accordion title={t.gospel + ' — ' + mergedGospel.ref} isOpen={open.evangelio} onToggle={function() { toggle('evangelio') }} highlight={true}>
                {mergedGospel.text
                  ? <p style={{ lineHeight: 1.9, fontSize: '0.95rem', color: '#3a3a3a', whiteSpace: 'pre-wrap' }}>{mergedGospel.text}</p>
                  : <p style={{ fontSize: '0.78rem', color: '#bbb', fontStyle: 'italic' }}>{t.fullTextSoon}</p>}
              </Accordion>
            )}
          </>
        ))}
      </div>

      {/* B) Reflexión */}
      <div style={s.card}>
        <div
          onClick={function() { toggle('reflexion') }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: open.reflexion ? '0.75rem' : 0 }}
        >
          <div style={s.cardTitle}>{t.reflectionTitle}</div>
          <span style={{ color: colors.vino, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{open.reflexion ? '▾' : '▸'}</span>
        </div>
        {open.reflexion && (!canReflection ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
            <p style={Object.assign({}, s.p, { marginBottom: '0.5rem', color: '#888', fontSize: '0.88rem' })}>
              {lang === 'en' ? 'Daily reflection for subscribers' : 'Reflexión diaria para suscriptores'}
            </p>
            <p style={Object.assign({}, s.p, { marginBottom: '1rem' })}>
              {user ? t.subscribeToRead : t.signInToRead}
            </p>
            <button
              style={Object.assign({}, s.btn(colors.vino), { marginTop: 0 })}
              onClick={function() { user ? (onSwitchView && onSwitchView('precios')) : (window.location.href = '/login') }}
            >
              {user ? t.unlockBtn : t.signInBtn}
            </button>
          </div>
        ) : !reflection ? (
          <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>{t.reflectionInPrep}</p>
        ) : (
          <div>
            {(mergedGospel.ref || reflection.gospel_ref) && (
              <p style={{ fontSize: '0.75rem', color: colors.oro, marginBottom: '1rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                {mergedGospel.ref || reflection.gospel_ref}
              </p>
            )}
            {(reflection.reflexion || reflection.silence || reflection.meditative_phrase || reflection.inner_question || reflection.brief_prayer) ? (
              <>
                {reflection.reflexion && (
                  <p style={Object.assign({}, s.p, { whiteSpace: 'pre-wrap', marginBottom: '1rem' })}>
                    {reflection.reflexion}
                  </p>
                )}
                {reflection.silence && (
                  <p style={Object.assign({}, s.p, { fontStyle: 'italic', color: '#777', marginBottom: '1rem' })}>
                    {reflection.silence}
                  </p>
                )}
                {reflection.meditative_phrase && (
                  <p style={Object.assign({}, s.p, { fontWeight: 'bold', marginBottom: '1rem' })}>
                    «{reflection.meditative_phrase}»
                  </p>
                )}
                {reflection.inner_question && (
                  <p style={Object.assign({}, s.p, { color: colors.verde, marginBottom: '1rem' })}>
                    {reflection.inner_question}
                  </p>
                )}
                {reflection.brief_prayer && (
                  <p style={Object.assign({}, s.p, { fontStyle: 'italic' })}>
                    {reflection.brief_prayer}
                  </p>
                )}
              </>
            ) : (
              <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>{t.reflectionInPrep}</p>
            )}
          </div>
        ))}
      </div>

      {/* C) Santo del día */}
      <div style={s.card}>
        <div
          onClick={function() { toggle('santo') }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: open.santo ? '0.75rem' : 0 }}
        >
          <div style={s.cardTitle}>{t.saintOfDay}</div>
          <span style={{ color: colors.vino, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{open.santo ? '▾' : '▸'}</span>
        </div>
        {open.santo && (!celebration && !saint ? (
          <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>{t.noInfo}</p>
        ) : (
          <>
            <h2 style={Object.assign({}, s.h1, { fontSize: '1.1rem', marginBottom: '0.2rem' })}>
              {saintName}
            </h2>
            {saintFeastDay && (
              <div style={{ fontSize: '0.78rem', color: colors.oro, marginBottom: '0.2rem' }}>{saintFeastDay}</div>
            )}
            {celebration && celebration.type && (
              <div style={{ fontSize: '0.72rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                {translateCelebration(celebration.type, lang)}
              </div>
            )}
            {saint && (saint.birth_year || saint.death_year) && (
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                {saint.birth_year && saint.death_year
                  ? saint.birth_year + ' – ' + saint.death_year
                  : saint.birth_year ? 'n. ' + saint.birth_year : '† ' + saint.death_year}
              </div>
            )}
            {saintBio && <p style={s.p}>{saintBio}</p>}
            {saintPatronage && (
              <p style={Object.assign({}, s.p, { fontStyle: 'italic', color: '#777', marginTop: '0.5rem', fontSize: '0.85rem' })}>
                {t.patronOf} {saintPatronage}
              </p>
            )}
            {saint && (saint.canonization_year || saint.canonized_by) && (
              <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '0.5rem' }}>
                {t.canonizedIn}{saint.canonization_year ? ' ' + saint.canonization_year : ''}
                {saint.canonized_by ? t.canonizedBy + saint.canonized_by : ''}
              </p>
            )}
            {saintPrayer && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e8dcc8' }}>
                <div style={{ fontSize: '0.68rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{t.prayerLabel}</div>
                <p style={Object.assign({}, s.p, { fontStyle: 'italic' })}>{saintPrayer}</p>
              </div>
            )}
          </>
        ))}
      </div>

      {/* D) Liturgia de las Horas */}
      <div style={s.card}>
        <div
          onClick={function() { toggle('liturgia') }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: open.liturgia ? '0.25rem' : 0 }}
        >
          <div style={s.cardTitle}>{t.liturgyHours}</div>
          <span style={{ color: colors.vino, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{open.liturgia ? '▾' : '▸'}</span>
        </div>
        {open.liturgia && <>
          <Accordion
            title={t.lauds + (hour >= 5 && hour < 12 ? ' · ' + t.morningPrayer : '')}
            isOpen={open.laudes}
            onToggle={function() { toggle('laudes') }}
            highlight={hour >= 5 && hour < 12}
          >
            {lh.laudes && lh.laudes.content
              ? <LiturgiaContent data={lh.laudes} lang={lang} />
              : <Proximamente t={t} />}
          </Accordion>
          <Accordion
            title={t.vespers + (hour >= 12 && hour < 20 ? ' · ' + t.afternoonPrayer : '')}
            isOpen={open.visperas}
            onToggle={function() { toggle('visperas') }}
            highlight={hour >= 12 && hour < 20}
          >
            {lh.visperas && lh.visperas.content
              ? <LiturgiaContent data={lh.visperas} lang={lang} />
              : <Proximamente t={t} />}
          </Accordion>
          <Accordion
            title={t.compline + ((hour >= 20 || hour < 5) ? ' · ' + t.nightPrayer : '')}
            isOpen={open.completas}
            onToggle={function() { toggle('completas') }}
            highlight={hour >= 20 || hour < 5}
          >
            {lh.completas && lh.completas.content
              ? <LiturgiaContent data={lh.completas} lang={lang} />
              : <Proximamente t={t} />}
          </Accordion>
        </>}
      </div>

      {/* E) Rosario */}
      <div style={s.card}>
        <div
          onClick={function() { toggle('rosario') }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: open.rosario ? '0.75rem' : 0 }}
        >
          <div style={s.cardTitle}>{t.rosaryOfDay}</div>
          <span style={{ color: colors.vino, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{open.rosario ? '▾' : '▸'}</span>
        </div>
        {open.rosario && (rosary
          ? <RosarioContent rosary={rosary} weekday={weekday} t={t} lang={lang} />
          : <Proximamente t={t} />)}
      </div>

      {/* F) Coronilla */}
      <div style={s.card}>
        <div
          onClick={function() { toggle('coronilla') }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: open.coronilla ? '0.75rem' : 0 }}
        >
          <div style={s.cardTitle}>{t.chapletTitle}</div>
          <span style={{ color: colors.vino, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{open.coronilla ? '▾' : '▸'}</span>
        </div>
        {open.coronilla && (chaplet ? <CoronillaContent chaplet={chaplet} t={t} /> : <Proximamente t={t} />)}
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
                  <span>{lang === 'en' ? (link.label_en || link.label_es) : (link.label_es || link.label_en)}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

// ── ViewDiarios ───────────────────────────────────────────────────────────────
function ViewDiarios({ onOpen, tier, user, lang, onSwitchView }) {
  var t = T[lang] || T.es
  var en = lang === 'en'
  var allUnlocked = tier === 'claraval'
  var slotCount = tier === 'claraval' ? 999 : tier === 'discipulo' ? 3 : tier === 'peregrino' ? 1 : 0

  var [progress, setProgress] = useState({})
  var [journalMetas, setJournalMetas] = useState({})
  var [entitled, setEntitled] = useState(null)   // null = cargando; array de {journal_slug, source}
  var [busy, setBusy] = useState(null)

  function loadEntitlements() {
    if (!user) { setEntitled([]); return }
    supabase.from('user_journal_entitlements').select('journal_slug, source').eq('user_id', user.id).then(function(r) {
      setEntitled(r.data || [])
    })
  }
  useEffect(function() { loadEntitlements() }, [user])

  useEffect(function() {
    if (!user) return
    supabase.from('journal_entries').select('journal_slug, day_number, week_number').eq('user_id', user.id).then(function(r) {
      if (r.data) {
        var p = {}
        r.data.forEach(function(e) {
          var unit = e.week_number != null ? e.week_number : (e.day_number || 0)
          if (!p[e.journal_slug] || unit > p[e.journal_slug]) p[e.journal_slug] = unit
        })
        setProgress(p)
      }
    })
  }, [user])

  useEffect(function() {
    supabase.from('journal_metadata').select('journal_slug, description').eq('lang', lang).then(function(r) {
      if (r.data) { var m = {}; r.data.forEach(function(row) { m[row.journal_slug] = row }); setJournalMetas(m) }
    })
  }, [lang])

  var entArr = entitled || []
  var entitledMap = {}
  entArr.forEach(function(row) { entitledMap[row.journal_slug] = row.source })
  // Solo los cupos de tier cuentan para el límite; redemptions/addons son extra
  var usedSlots = allUnlocked ? 0 : entArr.filter(function(r) { return r.source === 'tier' }).length
  var slotsLeft = Math.max(0, slotCount - usedSlots)
  var showSelector = !allUnlocked && slotCount > 0
  function isUnlocked(slug) {
    if (allUnlocked) return true
    var src = entitledMap[slug]
    if (!src) return false
    // Entitlements de tier solo cuentan si el tier sigue activo
    if (src === 'tier' && tier === 'free') return false
    return true
  }

  function claim(slug) {
    if (busy) return
    setBusy(slug)
    supabase.rpc('claim_journal', { p_slug: slug }).then(function(r) {
      setBusy(null)
      if (r.error) { alert(en ? 'Could not select this journal.' : 'No se pudo elegir este diario.'); return }
      loadEntitlements()
    })
  }
  function release(slug) {
    if (busy) return
    var ok = window.confirm(en ? 'Release this journal? You can choose another in its place.' : '¿Soltar este diario? Podrás elegir otro en su lugar.')
    if (!ok) return
    setBusy(slug)
    supabase.rpc('release_journal', { p_slug: slug }).then(function(r) {
      setBusy(null)
      if (r.error) { alert(en ? 'Could not release.' : 'No se pudo soltar.'); return }
      loadEntitlements()
    })
  }

  return (
    <div style={s.content}>
      <h2 style={Object.assign({}, s.h1, { marginBottom: '0.25rem' })}>{t.myJournals}</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: showSelector ? '0.75rem' : '1.5rem' }}>{t.journalSubtitle}</p>

      {showSelector && (
        <div style={{ backgroundColor: '#fdf8f0', border: '1px solid #e8dcc8', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#6b5b4b' }}>
          {en
            ? 'You have chosen ' + usedSlots + ' of ' + slotCount + ' journal' + (slotCount > 1 ? 's' : '') + '. '
              + (slotsLeft > 0 ? 'Tap "Choose" to unlock ' + (slotsLeft > 1 ? slotsLeft + ' more' : 'one more') + '.' : 'To swap, release one first.')
            : 'Has elegido ' + usedSlots + ' de ' + slotCount + ' diario' + (slotCount > 1 ? 's' : '') + '. '
              + (slotsLeft > 0 ? 'Toca «Elegir» para desbloquear ' + (slotsLeft > 1 ? slotsLeft + ' más' : 'uno más') + '.' : 'Para cambiar, suelta uno primero.')}
        </div>
      )}

      {entitled === null ? (
        <p style={{ color: '#888' }}>{t.loading}</p>
      ) : allUnlocked ? (
        <div style={s.journalGrid}>
          {JOURNALS.map(function(j) {
            var unit = progress[j.slug] || 0
            var pct = Math.round((unit / j.total) * 100)
            var unitLabel = j.type === 'weekly' ? t.weekLabel : t.dayLabel
            var meta = journalMetas[j.slug]
            var desc = meta && meta.description ? (meta.description.length > 80 ? meta.description.slice(0, 80) + '...' : meta.description) : null
            var title = en ? (j.titleEn || j.title) : j.title
            return (
              <div key={j.slug} style={Object.assign({}, s.journalCard, { cursor: 'pointer' })}
                   onClick={function() { onOpen(j, unit + 1) }}>
                <div style={{ fontSize: '0.7rem', color: colors.oro, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  {unitLabel + ' ' + (unit + 1) + ' / ' + j.total}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.texto }}>{title}</div>
                {desc && <p style={{ fontSize: '0.78rem', color: '#888', lineHeight: 1.4, marginTop: '0.3rem', marginBottom: 0 }}>{desc}</p>}
                <div style={{ height: '4px', backgroundColor: '#f0e8d8', borderRadius: '2px', marginTop: '0.75rem' }}>
                  <div style={{ height: '4px', width: pct + '%', backgroundColor: colors.oro, borderRadius: '2px' }} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (function() {
        var unlockedJournals = JOURNALS.filter(function(j) { return isUnlocked(j.slug) })
        if (unlockedJournals.length === 0) {
          return (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📖</div>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                {en ? 'You have no journals unlocked yet.' : 'Todavía no tienes diarios desbloqueados.'}
              </p>
              <button style={Object.assign({}, s.btn(colors.vino), { width: 'auto', padding: '0.65rem 1.5rem' })}
                      onClick={function() { onSwitchView && onSwitchView('catalogo') }}>
                {en ? 'Explore Catalog' : 'Explorar Catálogo'}
              </button>
            </div>
          )
        }
        return (
          <div>
            <div style={s.journalGrid}>
              {unlockedJournals.map(function(j) {
                var unit = progress[j.slug] || 0
                var pct = Math.round((unit / j.total) * 100)
                var unitLabel = j.type === 'weekly' ? t.weekLabel : t.dayLabel
                var meta = journalMetas[j.slug]
                var desc = meta && meta.description ? (meta.description.length > 80 ? meta.description.slice(0, 80) + '...' : meta.description) : null
                var title = en ? (j.titleEn || j.title) : j.title
                var isBusy = busy === j.slug
                return (
                  <div key={j.slug} style={Object.assign({}, s.journalCard, { cursor: 'pointer' })}
                       onClick={function() { onOpen(j, unit + 1) }}>
                    <div style={{ fontSize: '0.7rem', color: colors.oro, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      {unitLabel + ' ' + (unit + 1) + ' / ' + j.total}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: colors.texto }}>{title}</div>
                    {desc && <p style={{ fontSize: '0.78rem', color: '#888', lineHeight: 1.4, marginTop: '0.3rem', marginBottom: 0 }}>{desc}</p>}
                    <button onClick={function(e) { e.stopPropagation(); release(j.slug) }} disabled={isBusy}
                            style={{ background: 'none', border: 'none', color: colors.azul, cursor: 'pointer', fontSize: '0.72rem', padding: '0.4rem 0 0', marginTop: '0.3rem' }}>
                      {isBusy ? '…' : (en ? 'Release' : 'Soltar')}
                    </button>
                    <div style={{ height: '4px', backgroundColor: '#f0e8d8', borderRadius: '2px', marginTop: '0.75rem' }}>
                      <div style={{ height: '4px', width: pct + '%', backgroundColor: colors.oro, borderRadius: '2px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
            {slotsLeft > 0 && (
              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button style={{ background: 'none', border: '1px solid ' + colors.vino, color: colors.vino, borderRadius: '6px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontSize: '0.85rem' }}
                        onClick={function() { onSwitchView && onSwitchView('catalogo') }}>
                  {en
                    ? '+ Add journal (' + slotsLeft + ' slot' + (slotsLeft > 1 ? 's' : '') + ' left)'
                    : '+ Agregar diario (' + slotsLeft + ' cupo' + (slotsLeft > 1 ? 's' : '') + ' disponible' + (slotsLeft > 1 ? 's' : '') + ')'}
                </button>
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}

// ── ViewJournal ───────────────────────────────────────────────────────────────
function ViewJournal({ journal, initialUnit, onBack, user, lang }) {
  var t = T[lang] || T.es
  var isWeekly = journal.type === 'weekly'
  var [currentUnit, setCurrentUnit] = useState(initialUnit)
  var [answers, setAnswers] = useState({})
  var [saving, setSaving] = useState(false)
  var [saved, setSaved] = useState(false)
  var [loading, setLoading] = useState(true)
  var [questions, setQuestions] = useState([])
  var [metadata, setMetadata] = useState(null)
  var [showDesc, setShowDesc] = useState(true)
  var [patronSaint, setPatronSaint] = useState(null)
  var debounceRef = useRef(null)

  useEffect(function() {
    if (!journal.hasPatronSaint) return
    supabase.from('journal_content').select('title, content').eq('journal_slug', journal.slug).eq('section_type', 'patron_saint').eq('lang', lang).maybeSingle().then(function(r) {
      setPatronSaint(r.data || null)
    })
  }, [journal.slug, lang])

  useEffect(function() {
    if (currentUnit === 0) { setLoading(false); setQuestions([]); return }
    setLoading(true)
    setAnswers({})
    setSaved(false)
    var entriesPromise = user
      ? getJournalEntries(user.id, journal.slug, currentUnit, lang)
      : Promise.resolve(null)
    Promise.all([
      getJournalDay(journal.slug, currentUnit, lang, isWeekly),
      entriesPromise
    ]).then(function(results) {
      var day = results[0]
      setMetadata(day.metadata)
      setQuestions(day.questions)
      var a = {}
      if (results[1]) {
        results[1].forEach(function(e) { a[e.question_number || 1] = e.response_text || '' })
      } else {
        var lsData = lsJournalLoad(journal.slug, currentUnit, lang)
        Object.keys(lsData).forEach(function(k) { a[k] = lsData[k] })
      }
      setAnswers(a)
      setLoading(false)
    })
  }, [journal.slug, journal.type, currentUnit, user, lang])

  async function handleSave() {
    if (!user) {
      setSaved(true)
      setTimeout(function() { setSaved(false) }, 2000)
      return
    }
    setSaving(true)
    var saveList = questions.length > 0 ? questions : [{ question_number: 1 }]
    var entries = saveList.map(function(q) {
      var qn = q.question_number || 1
      return { question_number: qn, response_text: answers[qn] || '' }
    })
    await saveJournalEntries(user.id, journal.slug, currentUnit, lang, entries)
    setSaving(false); setSaved(true); setTimeout(function() { setSaved(false) }, 2000)
  }

  var unitLabel = isWeekly ? t.weekLabel : t.dayLabel
  var displayQuestions = questions.length > 0 ? questions : [{ question_number: 1, title: null, content: null }]
  var journalTitle = lang === 'en' ? (journal.titleEn || journal.title) : journal.title

  return (
    <div style={s.content}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: colors.vino, cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>{t.back}</button>

      {metadata && metadata.description && showDesc && currentUnit === 1 && (
        <div style={{ backgroundColor: '#fdf8f0', border: '1px solid #e8dcc8', borderRadius: '8px', padding: '1.25rem 1.25rem 1rem', marginBottom: '1rem', position: 'relative' }}>
          <p style={{ fontStyle: 'italic', lineHeight: 1.8, fontSize: '0.92rem', color: '#555', margin: 0 }}>{metadata.description}</p>
          <button onClick={function() { setShowDesc(false) }} style={{ position: 'absolute', top: '0.6rem', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '0.85rem' }}>✕</button>
        </div>
      )}

      {metadata && metadata.description && !showDesc && currentUnit === 1 && (
        <button onClick={function() { setShowDesc(true) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.75rem', padding: 0 }}>{t.aboutJournal}</button>
      )}

      <div style={s.card}>
        <div style={s.cardTitle}>{journalTitle} - {currentUnit === 0 ? t.patronSaint : unitLabel + ' ' + currentUnit}</div>
        {loading ? <p style={{ color: '#888' }}>{t.loading}</p> : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button onClick={function() { var minUnit = journal.hasPatronSaint ? 0 : 1; if (currentUnit > minUnit) setCurrentUnit(currentUnit - 1) }} disabled={currentUnit <= (journal.hasPatronSaint ? 0 : 1)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: currentUnit > (journal.hasPatronSaint ? 0 : 1) ? 'pointer' : 'default', color: currentUnit > (journal.hasPatronSaint ? 0 : 1) ? '#782F40' : '#ccc', fontSize: '0.85rem' }}>{t.prev}</button>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>{currentUnit === 0 ? t.patronSaint : unitLabel + ' ' + currentUnit + ' / ' + journal.total}</span>
              <button onClick={function() { if (currentUnit < journal.total) setCurrentUnit(currentUnit + 1) }} disabled={currentUnit >= journal.total} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: currentUnit < journal.total ? 'pointer' : 'default', color: currentUnit < journal.total ? '#782F40' : '#ccc', fontSize: '0.85rem' }}>{t.next}</button>
            </div>
            {currentUnit === 0 ? (
              patronSaint ? (
                <div>
                  {patronSaint.title && <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: colors.vino, margin: '0 0 0.75rem' }}>{patronSaint.title}</p>}
                  {patronSaint.content && <p style={{ fontStyle: 'italic', lineHeight: 1.8, fontSize: '0.92rem', color: '#555', margin: 0 }}>{patronSaint.content}</p>}
                </div>
              ) : <p style={{ color: '#888', fontStyle: 'italic' }}>{t.loading}</p>
            ) : (
              <div style={{ position: 'relative', userSelect: 'none' }} onContextMenu={function(e) { e.preventDefault() }}>
                {user && user.email && (
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                    {[0,1,2,3,4,5,6,7].map(function(i) {
                      return (
                        <div key={i} style={{ position: 'absolute', top: (i * 130) + 'px', left: '-30%', width: '160%', fontSize: '0.7rem', color: '#782F40', opacity: 0.06, transform: 'rotate(-35deg)', letterSpacing: '0.25em', whiteSpace: 'nowrap', userSelect: 'none' }}>
                          {user.email + '   ·   ' + user.email + '   ·   ' + user.email}
                        </div>
                      )
                    })}
                  </div>
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {metadata && metadata.opening_prayer && (
                    <p style={{ fontStyle: 'italic', lineHeight: 1.8, fontSize: '0.9rem', color: '#666', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f0e8d8' }}>
                      <span style={{ color: colors.vino, marginRight: '0.4rem' }}>✠</span>{metadata.opening_prayer}
                    </p>
                  )}
                  {displayQuestions.map(function(q, i) {
                    var qn = q.question_number || 1
                    var isLast = i === displayQuestions.length - 1
                    return (
                      <div key={qn} style={{ borderBottom: isLast ? 'none' : '1px solid #f0e8d8', paddingBottom: isLast ? 0 : '1rem', marginBottom: isLast ? 0 : '1rem' }}>
                        {q.title && <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: colors.vino, margin: '0 0 0.5rem' }}>{q.title}</p>}
                        {q.content && <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '0.95rem', color: '#444', margin: '0 0 0.5rem' }}>{q.content}</p>}
                        <textarea
                          key={journal.slug + '-' + currentUnit + '-' + qn}
                          style={Object.assign({}, s.textarea, { userSelect: 'text' })}
                          value={answers[qn] || ''}
                          onChange={function(e) {
                            var val = e.target.value
                            setAnswers(function(prev) {
                              var next = Object.assign({}, prev, { [qn]: val })
                              if (debounceRef.current) clearTimeout(debounceRef.current)
                              debounceRef.current = setTimeout(function() {
                                lsJournalSave(journal.slug, currentUnit, lang, next)
                              }, 500)
                              return next
                            })
                          }}
                          placeholder={t.writeHere}
                        />
                      </div>
                    )
                  })}
                  <button style={s.btn(saved ? colors.verde : colors.vino)} onClick={handleSave} disabled={saving}>{saving ? t.saving : saved ? t.saved : t.save}</button>
                  {metadata && metadata.closing_prayer && (
                    <p style={{ fontStyle: 'italic', lineHeight: 1.8, fontSize: '0.9rem', color: '#666', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0e8d8' }}>
                      <span style={{ color: colors.vino, marginRight: '0.4rem' }}>✠</span>{metadata.closing_prayer}
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── ViewPricing ───────────────────────────────────────────────────────────────
function ViewPricing({ onCheckout, loading, tier, lang }) {
  var t = T[lang] || T.es
  var lv = TIER_LEVELS[tier] || 0
  return (
    <div style={s.content}>
      <h2 style={Object.assign({}, s.h1, { marginBottom: '0.25rem' })}>{t.plans}</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{t.planSubtitle}</p>
      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.verde)}>{t.freeBadge}</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t.freePlanName}</h3>
        <p style={Object.assign({}, s.p, { fontSize: '0.85rem' })}>{t.freeDesc}</p>
        {lv === 0 && <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>{t.currentPlan}</div>}
      </div>
      <div style={s.pricingCard(lv < 1)}>
        <div style={Object.assign({}, s.badge(colors.oro), { color: lv < 1 ? colors.texto : 'white' })}>{lang === 'en' ? 'CLP $1,700/mo (~US$2)' : '$1.700 CLP/mes (~US$2)'}</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Peregrino</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{lang === 'en' ? 'Daily reflection + 1 journal' : 'Reflexion diaria + 1 journal'}</p>
        {lv >= 1 ? <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>{t.included}</div> : <button style={Object.assign({}, s.btn('white'), { color: colors.vino })} disabled={loading} onClick={function() { onCheckout('peregrino') }}>{loading ? t.loading : t.subscribe}</button>}
      </div>
      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.azul)}>{lang === 'en' ? 'CLP $3,400/mo (~US$4)' : '$3.400 CLP/mes (~US$4)'}</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Discipulo</h3>
        <p style={Object.assign({}, s.p, { fontSize: '0.85rem' })}>{lang === 'en' ? 'Reflection + 3 journals' : 'Reflexion + 3 journals'}</p>
        {lv >= 2 ? <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>{t.included}</div> : <button style={s.btn(colors.azul)} disabled={loading} onClick={function() { onCheckout('discipulo') }}>{loading ? t.loading : t.subscribe}</button>}
      </div>
      <div style={s.pricingCard(false)}>
        <div style={s.badge(colors.vino)}>{lang === 'en' ? 'CLP $5,400/mo (~US$6)' : '$5.400 CLP/mes (~US$6)'}</div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Claraval</h3>
        <p style={Object.assign({}, s.p, { fontSize: '0.85rem' })}>{lang === 'en' ? 'Everything: 9 journals + future content' : 'Todo: 9 journals + contenido futuro'}</p>
        {lv >= 3 ? <div style={Object.assign({}, s.badge(colors.verde), { marginTop: '0.75rem' })}>{t.currentPlan}</div> : <button style={s.btn(colors.vino)} disabled={loading} onClick={function() { onCheckout('claraval') }}>{loading ? t.loading : t.subscribe}</button>}
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #e8dcc8', textAlign: 'center' }}>
        <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '0.5rem' }}>
          {lang === 'en' ? 'Questions? We\'d love to hear from you.' : '¿Tienes preguntas? Con gusto te ayudamos.'}
        </p>
        <p style={{ fontSize: '0.85rem', color: colors.vino, fontWeight: 'bold', margin: '0 0 0.25rem' }}>
          {lang === 'en' ? 'Contact us' : 'Contáctanos'}
        </p>
        <a href="mailto:contactus@littleclaraval.com" style={{ display: 'block', color: colors.azul, fontSize: '0.85rem', textDecoration: 'none', marginBottom: '0.2rem' }}>
          contactus@littleclaraval.com
        </a>
        <a href="mailto:contacto@littleclaraval.com" style={{ display: 'block', color: '#aaa', fontSize: '0.78rem', textDecoration: 'none' }}>
          contacto@littleclaraval.com
        </a>
      </div>
    </div>
  )
}

// ── ViewRedeem ────────────────────────────────────────────────────────────────
function ViewRedeem({ user, lang }) {
  var t = T[lang] || T.es
  var [code, setCode] = useState(''); var [msg, setMsg] = useState(''); var [ld, setLd] = useState(false)
  async function handleRedeem() {
    if (!code.trim()) return; setLd(true); setMsg('')
    try {
      var sess = await supabase.auth.getSession()
      var token = sess.data.session ? sess.data.session.access_token : ''
      var r = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ code: code.trim() })
      })
      var d = await r.json()
      if (d.success) { setMsg(d.message); setCode('') } else { setMsg('Error: ' + d.error) }
    } catch (e) { setMsg('Error de conexion') }
    setLd(false)
  }
  return (
    <div style={s.content}>
      <div style={s.card}>
        <div style={s.cardTitle}>{t.redeemPageTitle}</div>
        <p style={Object.assign({}, s.p, { marginBottom: '1rem' })}>{t.redeemPageDesc}</p>
        <input type="text" value={code} onChange={function(e) { setCode(e.target.value.toUpperCase()) }} placeholder="CODIGO" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1.1rem', textAlign: 'center', letterSpacing: '0.2em', fontFamily: 'Georgia, serif', boxSizing: 'border-box', color: colors.texto }} />
        <button style={s.btn(colors.vino)} onClick={handleRedeem} disabled={ld}>{ld ? t.redeeming : t.redeemBtn}</button>
        {msg && <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: msg.includes('Error') ? '#fee2e2' : '#dcfce7', color: msg.includes('Error') ? '#991b1b' : '#166534' }}>{msg}</div>}
      </div>
    </div>
  )
}

// ── Liturgia helpers ──────────────────────────────────────────────────────────
function renderPsalmText(text, style) {
  return text.split('\n\n').map(function(para, i) {
    var lines = para.split('\n')
    return (
      <p key={i} style={Object.assign({}, style, { margin: '0 0 0.6rem' })}>
        {lines.map(function(line, j) {
          return j < lines.length - 1 ? [line, <br key={j} />] : line
        })}
      </p>
    )
  })
}

function LitugiaPsalterContent({ c, stl, lang }) {
  if (!c) return <p style={s.p}>Contenido no disponible aún</p>
  var L = lang === 'en'
    ? { hymn: 'Hymn', psalmody: 'Psalmody', canticle: 'Canticle', shortReading: 'Short Reading', responsory: 'Brief Responsory', intercessions: 'Intercessions', prayer: 'Prayer', amen: 'R. Amen.' }
    : { hymn: 'Himno', psalmody: 'Salmodia', canticle: 'Cántico', shortReading: 'Lectura breve', responsory: 'Responsorio breve', intercessions: 'Preces', prayer: 'Oración', amen: 'R. Amén.' }
  function PsalmBlock({ ps, label }) {
    if (!ps) return null
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        {label && <div style={stl.label}>{label}</div>}
        {ps.antiphon && <div style={stl.antiphon}>Ant. {ps.antiphon}</div>}
        {ps.ref && <div style={stl.psalmRef}>{ps.ref}</div>}
        {ps.text && renderPsalmText(ps.text, stl.prayer)}
        {ps.antiphon && <div style={stl.antiphon}>Ant. {ps.antiphon}</div>}
      </div>
    )
  }
  return (
    <div>
      {c.title && <div style={{ ...stl.label, fontSize: '0.85rem', marginBottom: '1rem' }}>{c.title}</div>}
      {c.hymn_text && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.hymn}</div>
            <div style={stl.hymn}>{c.hymn_text}</div>
          </div>
          <div style={stl.divider} />
        </>
      )}
      {(c.psalm1 || c.psalm2 || c.psalm3 || c.canticle) && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.psalmody}</div>
            <PsalmBlock ps={c.psalm1} label={null} />
            <PsalmBlock ps={c.psalm2} label={null} />
            <PsalmBlock ps={c.psalm3} label={null} />
            {c.canticle && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={stl.label}>{L.canticle}</div>
                {c.canticle.antiphon && <div style={stl.antiphon}>Ant. {c.canticle.antiphon}</div>}
                {c.canticle.ref && <div style={stl.psalmRef}>{c.canticle.ref}</div>}
                {c.canticle.text && <div style={stl.prayer}>{c.canticle.text}</div>}
                {c.canticle.antiphon && <div style={stl.antiphon}>Ant. {c.canticle.antiphon}</div>}
              </div>
            )}
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.short_reading && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.shortReading}</div>
            {c.short_reading.ref && <div style={stl.psalmRef}>{c.short_reading.ref}</div>}
            {c.short_reading.text && <div style={stl.prayer}>{c.short_reading.text}</div>}
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.responsory && (c.responsory.v || c.responsory.r) && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.responsory}</div>
            {c.responsory.v && <div style={stl.verse}>V. {c.responsory.v}</div>}
            {c.responsory.r && <div style={stl.response}>R. {c.responsory.r}</div>}
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.intercessions && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.intercessions}</div>
            <div style={stl.prayer}>{c.intercessions}</div>
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.closing_prayer && (
        <div style={stl.section}>
          <div style={stl.label}>{L.prayer}</div>
          <div style={stl.prayer}>{c.closing_prayer}</div>
          <div style={stl.response}>{L.amen}</div>
        </div>
      )}
    </div>
  )
}

function LiturgiaContent({ data, lang }) {
  if (!data) return <p style={s.p}>Contenido no disponible aún</p>
  var c = data.content
  if (!c || typeof c === 'string') return <p style={s.p}>Contenido no disponible aún</p>
  var L = lang === 'en'
    ? { opening: 'Opening Invocation', hymn: 'Hymn', psalmody: 'Psalmody', canticle: 'Canticle', shortReading: 'Short Reading', responsory: 'Brief Responsory', intercessions: 'Intercessions', prayer: 'Prayer', amen: 'R. Amen.' }
    : { opening: 'Invocación inicial', hymn: 'Himno', psalmody: 'Salmodia', canticle: 'Cántico', shortReading: 'Lectura breve', responsory: 'Responsorio breve', intercessions: 'Preces', prayer: 'Oración', amen: 'R. Amén.' }
  var stl = {
    section: { marginBottom: '1.25rem' },
    label: { fontSize: '0.7rem', color: colors.oro, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 'bold' },
    verse: { fontStyle: 'italic', marginBottom: '0.25rem', fontSize: '0.92rem', lineHeight: '1.5' },
    response: { fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.92rem', lineHeight: '1.5' },
    stanza: { marginBottom: '0.6rem', fontSize: '0.92rem', lineHeight: '1.6', whiteSpace: 'pre-line' },
    antiphon: { fontStyle: 'italic', color: colors.vino, fontSize: '0.88rem', marginBottom: '0.5rem', padding: '0.4rem 0.6rem', backgroundColor: 'rgba(114,47,55,0.05)', borderRadius: '4px', borderLeft: '3px solid ' + colors.vino },
    psalmRef: { fontSize: '0.8rem', color: '#888', marginBottom: '0.15rem' },
    psalmTitle: { fontSize: '0.88rem', fontWeight: 'bold', color: colors.vino, marginBottom: '0.6rem' },
    rubric: { fontSize: '0.82rem', color: '#999', fontStyle: 'italic', marginBottom: '0.75rem' },
    hymn: { whiteSpace: 'pre-line', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '0.75rem' },
    prayer: { fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '0.75rem' },
    divider: { borderTop: '1px solid #e8dcc8', margin: '1rem 0' }
  }
  console.log('branch:', (c.psalm1 !== undefined || c.psalm2 !== undefined) ? 'psalter' : 'psalms-array')
  if (c.psalm1 !== undefined || c.psalm2 !== undefined) {
    return <LitugiaPsalterContent c={c} stl={stl} lang={lang} />
  }
  return (
    <div>
      {c.opening && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.opening}</div>
            {c.opening?.v && <div style={stl.verse}>V. {c.opening.v}</div>}
            {c.opening?.r && <div style={stl.response}>R. {c.opening.r}</div>}
            {c.opening?.gloria && <div style={stl.stanza}>{c.opening.gloria}</div>}
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.exam && (
        <>
          <div style={stl.section}>
            <div style={stl.rubric}>{c.exam}</div>
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.hymn && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.hymn}</div>
            <div style={stl.hymn}>{c.hymn}</div>
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.psalms && c.psalms.length > 0 && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.psalmody}</div>
            {c.psalms.map(function(ps, i) {
              return (
                <div key={i} style={{ marginBottom: i < c.psalms.length - 1 ? '1.5rem' : 0 }}>
                  {ps.antiphon && <div style={stl.antiphon}>Ant. {ps.antiphon}</div>}
                  {ps.ref && <div style={stl.psalmRef}>{ps.ref}</div>}
                  {ps.title && <div style={stl.psalmTitle}>{ps.title}</div>}
                  {ps.stanzas
                    ? ps.stanzas.map(function(st, j) { return <div key={j} style={stl.stanza}>{st}</div> })
                    : (ps.text && renderPsalmText(ps.text, stl.prayer))}
                  {ps.antiphon && <div style={stl.antiphon}>Ant. {ps.antiphon}</div>}
                </div>
              )
            })}
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.canticle && (c.canticle.ref || c.canticle.text) && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.canticle}</div>
            {c.canticle.antiphon && <div style={stl.antiphon}>Ant. {c.canticle.antiphon}</div>}
            {c.canticle.ref && <div style={stl.psalmRef}>{c.canticle.ref}</div>}
            {c.canticle.text && <div style={stl.prayer}>{c.canticle.text}</div>}
            {c.canticle.antiphon && <div style={stl.antiphon}>Ant. {c.canticle.antiphon}</div>}
          </div>
          <div style={stl.divider} />
        </>
      )}
      {(c.reading || c.short_reading) && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.shortReading}</div>
            {(c.short_reading || c.reading).ref && <div style={stl.psalmRef}>{(c.short_reading || c.reading).ref}</div>}
            {(c.short_reading || c.reading).text && <div style={stl.prayer}>{(c.short_reading || c.reading).text}</div>}
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.responsory && (c.responsory.v || c.responsory.r) && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.responsory}</div>
            {c.responsory.v && <div style={stl.verse}>V. {c.responsory.v}</div>}
            {c.responsory.r && <div style={stl.response}>R. {c.responsory.r}</div>}
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.intercessions && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.intercessions}</div>
            <div style={stl.prayer}>{c.intercessions}</div>
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.closing_prayer && (
        <div style={stl.section}>
          <div style={stl.label}>{L.prayer}</div>
          <div style={stl.prayer}>{c.closing_prayer}</div>
          <div style={stl.response}>{L.amen}</div>
        </div>
      )}
      {c.nunc_dimittis && (
        <>
          <div style={stl.section}>
            {c.nunc_dimittis.title && <div style={stl.label}>{c.nunc_dimittis.title}</div>}
            {c.nunc_dimittis.ref && <div style={stl.psalmRef}>{c.nunc_dimittis.ref}</div>}
            {c.nunc_dimittis.antiphon && <div style={stl.antiphon}>Ant. {c.nunc_dimittis.antiphon}</div>}
            {c.nunc_dimittis.stanzas && c.nunc_dimittis.stanzas.map(function(st, j) {
              return <div key={j} style={stl.stanza}>{st}</div>
            })}
            {c.nunc_dimittis.antiphon && <div style={stl.antiphon}>Ant. {c.nunc_dimittis.antiphon}</div>}
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.prayer && (
        <>
          <div style={stl.section}>
            <div style={stl.label}>{L.prayer}</div>
            <div style={stl.prayer}>{c.prayer}</div>
            <div style={stl.response}>{L.amen}</div>
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.blessing && (
        <>
          <div style={stl.section}>
            <div style={stl.verse}>V. {c.blessing}</div>
            <div style={stl.response}>R. Amén.</div>
          </div>
          <div style={stl.divider} />
        </>
      )}
      {c.marian_antiphon && (
        <div style={stl.section}>
          {c.marian_antiphon.title && <div style={stl.label}>{c.marian_antiphon.title}</div>}
          {c.marian_antiphon.text && <div style={stl.hymn}>{c.marian_antiphon.text}</div>}
        </div>
      )}
    </div>
  )
}

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ date, onChange, onClose, t }) {
  var [viewYear, setViewYear] = useState(date.getFullYear())
  var [viewMonth, setViewMonth] = useState(date.getMonth())

  var todayStr = toDateStr(new Date())
  var selectedStr = toDateStr(date)

  var firstDay = new Date(viewYear, viewMonth, 1).getDay()
  var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  var cells = []
  for (var i = 0; i < firstDay; i++) cells.push(null)
  for (var d = 1; d <= daysInMonth; d++) cells.push(d)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  return (
    <div style={{
      position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
      backgroundColor: 'white', border: '1px solid #e8dcc8', borderRadius: '10px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.13)', padding: '0.85rem', zIndex: 200,
      minWidth: '270px', marginTop: '0.4rem',
    }}>
      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.vino, fontSize: '1.1rem', padding: '0.2rem 0.5rem', lineHeight: 1 }}>‹</button>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.texto }}>
          {t.monthNames[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.vino, fontSize: '1.1rem', padding: '0.2rem 0.5rem', lineHeight: 1 }}>›</button>
      </div>
      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.2rem' }}>
        {t.dayNamesShort.map(function(dn) {
          return <div key={dn} style={{ textAlign: 'center', fontSize: '0.6rem', color: '#bbb', padding: '0.15rem 0', fontWeight: 'bold', textTransform: 'uppercase' }}>{dn}</div>
        })}
      </div>
      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.15rem' }}>
        {cells.map(function(day, idx) {
          if (!day) return <div key={idx} />
          var cellStr = viewYear + '-' + String(viewMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0')
          var isSelected = cellStr === selectedStr
          var isToday = cellStr === todayStr
          return (
            <button
              key={idx}
              onClick={function() { onChange(new Date(viewYear, viewMonth, day, 12, 0, 0)); onClose() }}
              style={{
                background: isSelected ? colors.vino : isToday ? 'rgba(120,47,64,0.08)' : 'none',
                color: isSelected ? 'white' : isToday ? colors.vino : colors.texto,
                border: isToday && !isSelected ? '1px solid ' + colors.vino : '1px solid transparent',
                borderRadius: '50%', width: '30px', height: '30px',
                cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'Georgia, serif',
                fontWeight: isSelected || isToday ? 'bold' : 'normal',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto', padding: 0,
              }}
            >
              {day}
            </button>
          )
        })}
      </div>
      {/* Go to today shortcut */}
      <div style={{ textAlign: 'center', marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid #f0e8d8' }}>
        <button
          onClick={function() { onChange(new Date()); onClose() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.vino, fontSize: '0.75rem', fontFamily: 'Georgia, serif' }}
        >
          {t.goToToday}
        </button>
      </div>
    </div>
  )
}

// ── Date navigation bar ────────────────────────────────────────────────────────
function DateNav({ date, onChange, lang, t }) {
  var [showCal, setShowCal] = useState(false)

  var dayName = t.dayNames[date.getDay()]
  var day = date.getDate()
  var monthName = t.monthNamesLong[date.getMonth()]
  var year = date.getFullYear()
  var formatted = lang === 'en'
    ? dayName + ', ' + monthName + ' ' + day + ', ' + year
    : dayName + ' ' + day + ' de ' + monthName + ', ' + year

  function shift(delta) {
    var d = new Date(date)
    d.setDate(d.getDate() + delta)
    onChange(d)
  }

  return (
    <div style={{ textAlign: 'center', marginBottom: '1.25rem', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <button
          onClick={function() { shift(-1) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.vino, fontSize: '1.3rem', padding: '0.15rem 0.4rem', lineHeight: 1, borderRadius: '4px' }}
          aria-label="día anterior"
        >‹</button>
        <span
          onClick={function() { setShowCal(function(v) { return !v }) }}
          style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.texto, cursor: 'pointer', borderBottom: '1px dotted ' + colors.vino, paddingBottom: '0.1rem' }}
        >
          {formatted}
        </span>
        <button
          onClick={function() { shift(1) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.vino, fontSize: '1.3rem', padding: '0.15rem 0.4rem', lineHeight: 1, borderRadius: '4px' }}
          aria-label="día siguiente"
        >›</button>
      </div>
      {showCal && (
        <>
          <div onClick={function() { setShowCal(false) }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 199 }} />
          <MiniCalendar date={date} onChange={onChange} onClose={function() { setShowCal(false) }} t={t} />
        </>
      )}
    </div>
  )
}

// ── Language toggle pill ──────────────────────────────────────────────────────
function LangToggle({ lang, onChange }) {
  var pillStyle = {
    display: 'flex', alignItems: 'center', borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.4)', overflow: 'hidden', fontSize: '0.72rem',
  }
  var btnStyle = function(active) {
    return {
      background: active ? 'white' : 'transparent',
      color: active ? colors.vino : 'rgba(255,255,255,0.8)',
      border: 'none', padding: '0.22rem 0.55rem',
      cursor: 'pointer', fontWeight: active ? 'bold' : 'normal',
      fontFamily: 'Georgia, serif', fontSize: '0.72rem', lineHeight: 1,
    }
  }
  return (
    <div style={pillStyle}>
      <button style={btnStyle(lang === 'es')} onClick={function() { onChange('es') }}>ES</button>
      <button style={btnStyle(lang === 'en')} onClick={function() { onChange('en') }}>EN</button>
    </div>
  )
}

// ── ViewCatalog (Get Your Journals) ─────────────────────────────────────────
function ViewCatalog({ onSwitchView, tier, user, lang }) {
  var t = T[lang] || T.es
  var en = lang === 'en'
  var [journals, setJournals] = useState([])
  var [loading, setLoading] = useState(true)
  var [entitled, setEntitled] = useState([])   // {journal_slug, source}[]
  var [busy, setBusy] = useState(null)

  useEffect(function() {
    setLoading(true)
    supabase
      .from('journal_metadata')
      .select('journal_slug, title, description, cover_url, audience, sort_order')
      .eq('lang', lang)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(function(r) { setJournals(r.data || []); setLoading(false) })
  }, [lang])

  useEffect(function() {
    if (!user) { setEntitled([]); return }
    supabase.from('user_journal_entitlements').select('journal_slug, source').eq('user_id', user.id)
      .then(function(r) { setEntitled(r.data || []) })
  }, [user])

  var hasAll = tier === 'claraval'
  var slotCount = tier === 'claraval' ? 999 : tier === 'discipulo' ? 3 : tier === 'peregrino' ? 1 : 0
  var usedSlots = entitled.filter(function(r) { return r.source === 'tier' }).length
  var slotsLeft = Math.max(0, slotCount - usedSlots)
  var entitledSlugs = {}
  entitled.forEach(function(r) { entitledSlugs[r.journal_slug] = true })

  function claimFromCatalog(slug) {
    if (busy) return
    setBusy(slug)
    supabase.rpc('claim_journal', { p_slug: slug }).then(function(r) {
      setBusy(null)
      if (r.error) { alert(en ? 'Could not select this journal.' : 'No se pudo elegir este diario.'); return }
      supabase.from('user_journal_entitlements').select('journal_slug, source').eq('user_id', user.id)
        .then(function(r2) { setEntitled(r2.data || []) })
    })
  }

  function audienceColor(a) { return a === 'hombres' ? colors.azul : a === 'mujeres' ? colors.vino : colors.verde }

  return (
    <div style={s.content}>
      <h2 style={Object.assign({}, s.h1, { marginBottom: '0.25rem' })}>{t.catalogTitle}</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{t.catalogSubtitle}</p>
      {loading ? <p style={{ color: '#888' }}>{t.loading}</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {journals.map(function(j) {
            var slug = j.journal_slug
            var isBusy = busy === slug
            var owned = entitledSlugs[slug]
            return (
              <div key={slug} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', aspectRatio: '4 / 5', backgroundColor: '#ece3d2', overflow: 'hidden' }}>
                  {j.cover_url && (
                    <img src={j.cover_url} alt={j.title || slug}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={function(e) { e.target.style.display = 'none' }} />
                  )}
                </div>
                <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: colors.texto, marginBottom: '0.35rem' }}>{j.title || slug}</div>
                  {j.audience && (
                    <div style={{ alignSelf: 'flex-start', backgroundColor: audienceColor(j.audience), color: 'white', borderRadius: '20px', padding: '0.1rem 0.6rem', fontSize: '0.68rem', marginBottom: '0.5rem' }}>
                      {(t.audienceLabels && t.audienceLabels[j.audience]) || ''}
                    </div>
                  )}
                  {j.description && (
                    <p style={{ fontSize: '0.78rem', color: '#777', lineHeight: 1.5, margin: '0 0 0.85rem' }}>
                      {j.description.length > 120 ? j.description.slice(0, 120) + '…' : j.description}
                    </p>
                  )}
                  <div style={{ marginTop: 'auto' }}>
                    {hasAll || owned ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <div style={Object.assign({}, s.badge(colors.verde), { marginBottom: 0 })}>
                          {owned ? (en ? 'In your library' : 'En tu biblioteca') : t.includedInPlan}
                        </div>
                        {owned && (
                          <button style={{ background: 'none', border: 'none', color: colors.azul, cursor: 'pointer', fontSize: '0.78rem', padding: 0 }}
                                  onClick={function() { onSwitchView && onSwitchView('diarios') }}>
                            {en ? 'Open →' : 'Abrir →'}
                          </button>
                        )}
                      </div>
                    ) : slotsLeft > 0 ? (
                      <button style={Object.assign({}, s.btn(colors.vino), { marginTop: 0, fontSize: '0.82rem', padding: '0.6rem' })}
                              disabled={isBusy}
                              onClick={function() { claimFromCatalog(slug) }}>
                        {isBusy ? '…' : (en ? 'Choose this journal' : 'Elegir este diario')}
                      </button>
                    ) : (
                      <button style={Object.assign({}, s.btn(colors.vino), { marginTop: 0, fontSize: '0.82rem', padding: '0.6rem' })}
                              onClick={function() { onSwitchView && onSwitchView('precios') }}>
                        {t.getIt}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── App root ──────────────────────────────────────────────────────────────────
function App() {
  var [vista, setVista] = useState('hoy')
  var [journalAbierto, setJournalAbierto] = useState(null)
  var [journalUnit, setJournalUnit] = useState(1)
  var [user, setUser] = useState(null)
  var [profile, setProfile] = useState(null)
  var [loading, setLoading] = useState(false)
  var [checking, setChecking] = useState(true)
  var [lang, setLangState] = useState('es')
  var [selectedDate, setSelectedDate] = useState(function() { return new Date() })

  // Initialize lang and selectedDate from localStorage / URL on mount
  useEffect(function() {
    try {
      var saved = localStorage.getItem('lc_lang')
      if (saved === 'es' || saved === 'en') setLangState(saved)
    } catch(e) {}

    // Read date from URL pathname: /2026-05-31 or /hoy
    try {
      var path = window.location.pathname
      var m = path.match(/^\/(\d{4}-\d{2}-\d{2})$/)
      if (m) {
        var d = new Date(m[1] + 'T12:00:00')
        if (!isNaN(d)) setSelectedDate(d)
      }
    } catch(e) {}
  }, [])

  function setLang(l) {
    setLangState(l)
    try { localStorage.setItem('lc_lang', l) } catch(e) {}
  }

  function changeDate(d) {
    setSelectedDate(d)
    var todayStr = toDateStr(new Date())
    var selStr = toDateStr(d)
    var url = selStr === todayStr ? '/' : '/' + selStr
    try { window.history.pushState({}, '', url) } catch(e) {}
  }

  useEffect(function() {
    supabase.auth.getSession().then(function(res) {
      if (res.data.session) {
        setUser(res.data.session.user)
        supabase.from('profiles').select('*').eq('id', res.data.session.user.id).single().then(function(p) {
          if (p.data) setProfile(p.data)
          setChecking(false)
        }).catch(function() { setChecking(false) })
      } else {
        setChecking(false)
      }
    })

    var { data: { subscription } } = supabase.auth.onAuthStateChange(function(event, session) {
      if (event === 'SIGNED_OUT') {
        window.location.href = '/login'
      }
      if (event === 'TOKEN_REFRESHED' && session) {
        setUser(session.user)
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(function(p) { if (p.data) setProfile(p.data) })
      }
    })

    return function() { subscription.unsubscribe() }
  }, [])

  var tier = getEffectiveTier(profile)
  var t = T[lang] || T.es

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

  if (checking) return <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', color: colors.vino }}>{t.loading}</div>

  var tabs = [
    { id: 'hoy', label: t.today },
    { id: 'diarios', label: t.journals },
    { id: 'catalogo', label: t.catalogTab },
    { id: 'precios', label: t.plans },
    { id: 'canjear', label: t.redeem },
  ]

  return (
    <div style={s.app}>
      <header style={s.header}>
        <span style={s.logo}>Little Claraval</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LangToggle lang={lang} onChange={setLang} />
          {!user && <button onClick={function() { window.location.href = '/login' }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.7rem' }}>{t.signInBtn}</button>}
          {user && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>{user.email}</span>}
          {user && <button onClick={function() { supabase.auth.signOut().then(function() { window.location.href = '/login' }) }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.7rem' }}>{t.signOut}</button>}
        </div>
      </header>
      <nav style={s.nav}>
        {tabs.map(function(tab) { return <button key={tab.id} style={s.navBtn(vista === tab.id)} onClick={function() { setVista(tab.id); setJournalAbierto(null) }}>{tab.label}</button> })}
      </nav>
      {vista === 'hoy' && <ViewHoy tier={tier} user={user} onSwitchView={setVista} lang={lang} selectedDate={selectedDate} onDateChange={changeDate} />}
      {vista === 'diarios' && !journalAbierto && <ViewDiarios onOpen={function(j, u) { setJournalAbierto(j); setJournalUnit(u) }} tier={tier} user={user} lang={lang} onSwitchView={setVista} />}
      {vista === 'diarios' && journalAbierto && <ViewJournal journal={journalAbierto} initialUnit={journalUnit} onBack={function() { setJournalAbierto(null) }} user={user} lang={lang} />}
      {vista === 'catalogo' && <ViewCatalog onSwitchView={setVista} tier={tier} user={user} lang={lang} />}
      {vista === 'precios' && <ViewPricing onCheckout={handleCheckout} loading={loading} tier={tier} lang={lang} />}
      {vista === 'canjear' && <ViewRedeem user={user} lang={lang} />}
    </div>
  )
}

export default function Home() {
  return <App />
}
