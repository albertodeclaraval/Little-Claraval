'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import ComingSoon from './page.comingsoon'
import { fetchDailyReadings, fetchLiturgicalDay } from './lib/liturgical-api'
import { fetchSaint, fetchReflection, fetchLiturgyHour, fetchRosary, fetchChaplet, fetchAppLinks, fetchDayReadings } from './lib/content'

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

var prayerSectionHeader = { fontSize: '0.78rem', fontWeight: 'bold', color: '#782F40', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }
var prayerBodyText = { lineHeight: 1.8, fontSize: '0.9rem', color: '#444', margin: '0 0 0.3rem' }
var prayerLatinText = { fontStyle: 'italic', color: '#aaa', fontSize: '0.85rem', margin: 0 }
var prayerLabel = { fontSize: '0.72rem', color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 0.2rem' }
var prayerDivider = { borderTop: '1px solid #e8dcc8', margin: '0.9rem 0' }

function CoronillaContent({ chaplet }) {
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
          <p style={prayerSectionHeader}>Oraciones Iniciales</p>
          {[
            { key: 'sign_of_cross', label: 'Señal de la Cruz' },
            { key: 'opening_prayer', label: 'Oración Inicial' },
            { key: 'our_father', label: 'Padrenuestro' },
            { key: 'hail_mary', label: 'Ave María' },
            { key: 'apostles_creed', label: 'Credo' },
          ].map(function(item) {
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
          <p style={prayerSectionHeader}>En las cuentas grandes</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.1rem', color: '#782F40', flexShrink: 0, lineHeight: 1.65 }}>●</span>
            <p style={prayerBodyText}>{c.eternal_father}</p>
          </div>
        </>
      )}

      {c.small_bead && (
        <>
          <div style={prayerDivider} />
          <p style={prayerSectionHeader}>En las cuentas pequeñas</p>
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
                  (repetir 3 veces)
                </span>
              </p>
              <p style={prayerBodyText}>{c.closing.holy_god}</p>
            </div>
          )}
          {c.closing.final_prayer && (
            <div>
              <p style={prayerSectionHeader}>Oración Final</p>
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
            <span>Cómo rezarla</span>
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

var PRAYER_LABELS = {
  sign_of_cross: 'Señal de la Cruz', apostles_creed: 'Credo',
  our_father: 'Padrenuestro', hail_mary: 'Ave María',
  glory_be: 'Gloria', fatima_prayer: 'Oración de Fátima',
  hail_holy_queen: 'Salve', final_prayer: 'Oración Final'
}

var MYSTERY_CIRCLES = ['①', '②', '③', '④', '⑤']

function RosarioContent({ rosary, weekday }) {
  var [showInstructions, setShowInstructions] = useState(false)
  var [showPrayers, setShowPrayers] = useState(false)

  if (!rosary) return <Proximamente />

  var mysteries = rosary.mysteries
  var prayers = rosary.prayers
  var setName = ROSARY_NAMES[weekday] || 'Rosario'
  var setNameLatin = ROSARY_NAMES_LATIN[weekday] || ''

  return (
    <div>
      <h3 style={{ fontSize: '1rem', color: '#2C1810', margin: '0 0 0.2rem', fontWeight: 'bold' }}>{setName}</h3>
      {setNameLatin && <p style={{ fontStyle: 'italic', color: '#aaa', fontSize: '0.83rem', margin: '0 0 0.9rem' }}>{setNameLatin}</p>}

      {/* Cómo rezar — colapsable */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={function() { setShowInstructions(function(v) { return !v }) }}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#4B643C', fontSize: '0.82rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <span>{showInstructions ? '▾' : '▸'}</span>
          <span>Cómo rezar el Rosario</span>
        </button>
        {showInstructions && (
          <ol style={{ margin: '0.6rem 0 0', paddingLeft: '1.3rem', backgroundColor: '#fdf8f0', borderRadius: '6px', padding: '0.7rem 0.7rem 0.7rem 2rem' }}>
            {[
              'Señal de la Cruz',
              'Credo',
              '1 Padrenuestro + 3 Ave Marías + Gloria',
              'Anunciar cada misterio — 1 Padrenuestro + 10 Ave Marías + Gloria + Oración de Fátima',
              'Salve + Oración final',
            ].map(function(step, i) {
              return <li key={i} style={{ fontSize: '0.86rem', color: '#555', lineHeight: 1.7, marginBottom: '0.3rem' }}>{step}</li>
            })}
          </ol>
        )}
      </div>

      {/* Los 5 Misterios */}
      {mysteries && Array.isArray(mysteries) && mysteries.length > 0 && (
        <div>
          <p style={prayerSectionHeader}>Los 5 Misterios</p>
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
                    <span style={{ color: '#bbb', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fruto: </span>
                    <span style={{ fontStyle: 'italic', color: '#666' }}>{m.fruit}</span>
                    {m.fruit_latin && <span style={{ fontStyle: 'italic', color: '#bbb', fontSize: '0.78rem' }}> / {m.fruit_latin}</span>}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Oraciones — colapsable */}
      {prayers && typeof prayers === 'object' && (
        <div style={{ borderTop: '1px solid #e8dcc8', paddingTop: '0.75rem' }}>
          <button
            onClick={function() { setShowPrayers(function(v) { return !v }) }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#4B643C', fontSize: '0.82rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>{showPrayers ? '▾' : '▸'}</span>
            <span>Ver oraciones completas</span>
          </button>
          {showPrayers && (
            <div style={{ marginTop: '0.75rem' }}>
              {Object.keys(prayers).map(function(key) {
                var val = prayers[key]
                if (!val) return null
                var label = PRAYER_LABELS[key] || key
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
  var [supabaseReadings, setSupabaseReadings] = useState(null)
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
      fetchLiturgyHour('lauds', 1, weekday, 'ordinary', 'es'),
      fetchLiturgyHour('vespers', 1, weekday, 'ordinary', 'es'),
      fetchLiturgyHour('compline', 1, weekday, 'ordinary', 'es'),
      fetchRosary(weekday, 'es'),
      fetchChaplet('es'),
      fetchAppLinks(),
      fetchDayReadings(dateStr)
    ]).then(function(r) {
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
        {supabaseReadings ? (
          /* Texto completo desde Supabase */
          <>
            {supabaseReadings.first_reading_ref_es && (
              <div className="reading-block">
                <div className="reading-label">Primera Lectura</div>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.texto, margin: '0 0 0.6rem' }}>{supabaseReadings.first_reading_ref_es}</p>
                {supabaseReadings.first_reading_text_es && (
                  <p style={{ lineHeight: 1.85, fontSize: '0.95rem', color: '#3a3a3a', whiteSpace: 'pre-wrap' }}>{supabaseReadings.first_reading_text_es}</p>
                )}
              </div>
            )}
            {supabaseReadings.psalm_ref_es && (
              <div className="reading-block">
                <div className="reading-label">Salmo</div>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.texto, margin: '0 0 0.6rem' }}>{supabaseReadings.psalm_ref_es}</p>
                {supabaseReadings.psalm_text_es && (
                  <p style={{ lineHeight: 1.85, fontSize: '0.95rem', color: '#3a3a3a', whiteSpace: 'pre-wrap' }}>{supabaseReadings.psalm_text_es}</p>
                )}
              </div>
            )}
            {supabaseReadings.second_reading_ref_es && (
              <div className="reading-block">
                <div className="reading-label">Segunda Lectura</div>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.texto, margin: '0 0 0.6rem' }}>{supabaseReadings.second_reading_ref_es}</p>
                {supabaseReadings.second_reading_text_es && (
                  <p style={{ lineHeight: 1.85, fontSize: '0.95rem', color: '#3a3a3a', whiteSpace: 'pre-wrap' }}>{supabaseReadings.second_reading_text_es}</p>
                )}
              </div>
            )}
            {supabaseReadings.gospel_ref_es && (
              <div className="reading-block" style={{ borderBottom: 'none', marginBottom: 0, backgroundColor: '#fdf8f0', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid ' + colors.vino }}>
                <div className="reading-label" style={{ color: colors.vino }}>Evangelio</div>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: colors.vino, margin: '0 0 0.6rem' }}>{supabaseReadings.gospel_ref_es}</p>
                {supabaseReadings.gospel_text_es && (
                  <p style={{ lineHeight: 1.9, fontSize: '0.95rem', color: '#3a3a3a', whiteSpace: 'pre-wrap' }}>{supabaseReadings.gospel_text_es}</p>
                )}
              </div>
            )}
          </>
        ) : !rd ? (
          <p style={Object.assign({}, s.p, { color: '#aaa', fontStyle: 'italic' })}>
            No se pudieron cargar las lecturas. Verifica tu conexión.
          </p>
        ) : (
          /* Solo referencias desde la API */
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
            <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#bbb', fontStyle: 'italic' }}>
              Texto completo próximamente
            </p>
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
            ? <LiturgiaContent data={lh.laudes} />
            : <Proximamente />}
        </Accordion>
        <Accordion
          title={'Vísperas' + (hour >= 12 && hour < 20 ? ' · Oración de la tarde' : '')}
          isOpen={open.visperas}
          onToggle={function() { toggle('visperas') }}
          highlight={hour >= 12 && hour < 20}
        >
          {lh.visperas && lh.visperas.content
            ? <LiturgiaContent data={lh.visperas} />
            : <Proximamente />}
        </Accordion>
        <Accordion
          title={'Completas' + ((hour >= 20 || hour < 5) ? ' · Oración de la noche' : '')}
          isOpen={open.completas}
          onToggle={function() { toggle('completas') }}
          highlight={hour >= 20 || hour < 5}
        >
          {lh.completas && lh.completas.content
            ? <LiturgiaContent data={lh.completas} />
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
        {open.rosario && (rosary ? <RosarioContent rosary={rosary} weekday={weekday} /> : <Proximamente />)}
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
        {open.coronilla && (chaplet ? <CoronillaContent chaplet={chaplet} /> : <Proximamente />)}
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

function LiturgiaContent({ data }) {
  var c = data.content
  if (!c || typeof c === 'string') return <p style={s.p}>{c || ''}</p>
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
  return (
    <div>
      <div style={stl.section}>
        <div style={stl.label}>Invocación inicial</div>
        <div style={stl.verse}>V. {c.opening.v}</div>
        <div style={stl.response}>R. {c.opening.r}</div>
        <div style={stl.stanza}>{c.opening.gloria}</div>
      </div>
      <div style={stl.divider} />
      <div style={stl.section}>
        <div style={stl.rubric}>{c.exam}</div>
      </div>
      <div style={stl.divider} />
      <div style={stl.section}>
        <div style={stl.label}>Himno</div>
        <div style={stl.hymn}>{c.hymn}</div>
      </div>
      <div style={stl.divider} />
      <div style={stl.section}>
        <div style={stl.label}>Salmodia</div>
        {c.psalms.map(function(ps, i) {
          return (
            <div key={i} style={{ marginBottom: i < c.psalms.length - 1 ? '1.5rem' : 0 }}>
              <div style={stl.antiphon}>Ant. {ps.antiphon}</div>
              <div style={stl.psalmRef}>{ps.ref}</div>
              <div style={stl.psalmTitle}>{ps.title}</div>
              {ps.stanzas.map(function(st, j) {
                return <div key={j} style={stl.stanza}>{st}</div>
              })}
              <div style={stl.antiphon}>Ant. {ps.antiphon}</div>
            </div>
          )
        })}
      </div>
      <div style={stl.divider} />
      <div style={stl.section}>
        <div style={stl.label}>Lectura breve</div>
        <div style={stl.psalmRef}>{c.reading.ref}</div>
        <div style={stl.prayer}>{c.reading.text}</div>
      </div>
      <div style={stl.divider} />
      <div style={stl.section}>
        <div style={stl.label}>Responsorio breve</div>
        <div style={stl.verse}>V. {c.responsory.v}</div>
        <div style={stl.response}>R. {c.responsory.r}</div>
      </div>
      <div style={stl.divider} />
      <div style={stl.section}>
        <div style={stl.label}>{c.nunc_dimittis.title}</div>
        <div style={stl.psalmRef}>{c.nunc_dimittis.ref}</div>
        <div style={stl.antiphon}>Ant. {c.nunc_dimittis.antiphon}</div>
        {c.nunc_dimittis.stanzas.map(function(st, j) {
          return <div key={j} style={stl.stanza}>{st}</div>
        })}
        <div style={stl.antiphon}>Ant. {c.nunc_dimittis.antiphon}</div>
      </div>
      <div style={stl.divider} />
      <div style={stl.section}>
        <div style={stl.label}>Oración</div>
        <div style={stl.prayer}>{c.prayer}</div>
        <div style={stl.response}>R. Amén.</div>
      </div>
      <div style={stl.divider} />
      <div style={stl.section}>
        <div style={stl.verse}>V. {c.blessing}</div>
        <div style={stl.response}>R. Amén.</div>
      </div>
      <div style={stl.divider} />
      <div style={stl.section}>
        <div style={stl.label}>{c.marian_antiphon.title}</div>
        <div style={stl.hymn}>{c.marian_antiphon.text}</div>
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
        supabase.from('profiles').select('*').eq('id', res.data.session.user.id).single().then(function(p) {
          if (p.data) setProfile(p.data)
          setChecking(false)
        }).catch(function() { setChecking(false) })
      } else {
        window.location.href = '/login'
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
