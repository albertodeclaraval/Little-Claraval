'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

var supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
var ADMIN_EMAILS = ['betoyac@gmail.com', 'albertodeclaraval@gmail.com']
var colors = { pergamino: '#F8F1E6', vino: '#782F40', oro: '#B4903E', texto: '#2C1810', verde: '#4B643C' }

export default function AdminPage() {
  var [user, setUser] = useState(null)
  var [authorized, setAuthorized] = useState(false)
  var [codes, setCodes] = useState([])
  var [tier, setTier] = useState('claraval')
  var [days, setDays] = useState(30)
  var [lifetime, setLifetime] = useState(false)
  var [maxUses, setMaxUses] = useState(1)
  var [customCode, setCustomCode] = useState('')
  var [msg, setMsg] = useState('')

  useEffect(function() {
    supabase.auth.getSession().then(function(res) {
      if (res.data.session) {
        setUser(res.data.session.user)
        if (ADMIN_EMAILS.includes(res.data.session.user.email)) { setAuthorized(true); loadCodes() }
      }
    })
  }, [])

  function loadCodes() {
    supabase.from('promo_codes').select('*').order('created_at', { ascending: false }).then(function(res) { if (res.data) setCodes(res.data) })
  }

  function generateCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    var code = 'LC-'
    for (var i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
    return code
  }

  async function handleCreate() {
    var code = customCode.trim() ? customCode.trim().toUpperCase() : generateCode()
    var res = await supabase.from('promo_codes').insert({
      code: code,
      tier: tier,
      duration_days: lifetime ? 0 : parseInt(days),
      max_redemptions: parseInt(maxUses),
    })
    if (res.error) {
      setMsg('Error: ' + res.error.message)
    } else {
      setMsg('Codigo creado: ' + code + (lifetime ? ' (vitalicio)' : ''))
      setCustomCode('')
      loadCodes()
    }
  }

  if (!authorized) {
    return (<div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}><p style={{ color: colors.texto }}>Acceso no autorizado.</p></div>)
  }

  return (
    <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', fontFamily: 'Georgia, serif', color: colors.texto, padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: colors.vino, marginBottom: '1rem' }}>Admin</h1>
        <a href="/admin/lecturas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textDecoration: 'none', color: colors.texto }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: colors.vino }}>Editor de Lecturas</div>
            <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.2rem' }}>Cargar y editar lecturas litúrgicas del día</div>
          </div>
          <span style={{ color: colors.vino, fontSize: '1.1rem' }}>→</span>
        </a>
        <a href="/admin/importar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textDecoration: 'none', color: colors.texto }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: colors.vino }}>Importar desde Sheets</div>
            <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.2rem' }}>Santos, lecturas, reflexiones, journals y más</div>
          </div>
          <span style={{ color: colors.vino, fontSize: '1.1rem' }}>→</span>
        </a>
        <a href="/admin/journals" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textDecoration: 'none', color: colors.texto }}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: colors.vino }}>Metadatos de Journals</div>
            <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.2rem' }}>Descripción, oración de apertura y cierre por journal</div>
          </div>
          <span style={{ color: colors.vino, fontSize: '1.1rem' }}>→</span>
        </a>
        <h3 style={{ color: colors.vino, marginBottom: '1rem', fontSize: '1rem' }}>Códigos Promo</h3>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '1rem', color: colors.vino }}>Crear codigo nuevo</h3>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 'bold' }}>Nombre del codigo (opcional)</label>
            <input type="text" value={customCode} onChange={function(e) { setCustomCode(e.target.value) }} placeholder="Ej: BESHITO, FAMILIA, NAVIDAD2026..." style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', color: colors.texto, boxSizing: 'border-box', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
            <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>Si lo dejas vacio se genera uno automatico (LC-XXXXXX)</p>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 'bold' }}>Tier</label>
            <select value={tier} onChange={function(e) { setTier(e.target.value) }} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', color: colors.texto }}>
              <option value="peregrino">Peregrino</option>
              <option value="discipulo">Discipulo</option>
              <option value="claraval">Claraval</option>
            </select>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={lifetime} onChange={function(e) { setLifetime(e.target.checked) }} />
              <span style={{ fontWeight: 'bold' }}>Vitalicio (no expira nunca)</span>
            </label>
          </div>
          {!lifetime && (
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 'bold' }}>Duracion (dias)</label>
              <input type="number" value={days} onChange={function(e) { setDays(e.target.value) }} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', color: colors.texto, boxSizing: 'border-box' }} />
            </div>
          )}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem', fontWeight: 'bold' }}>Usos maximos</label>
            <input type="number" value={maxUses} onChange={function(e) { setMaxUses(e.target.value) }} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd', color: colors.texto, boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleCreate} style={{ backgroundColor: colors.vino, color: 'white', border: 'none', borderRadius: '6px', padding: '0.75rem 1.5rem', cursor: 'pointer', width: '100%', fontSize: '0.9rem' }}>Generar codigo</button>
          {msg && <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: msg.includes('Error') ? '#991b1b' : colors.vino, fontWeight: 'bold' }}>{msg}</p>}
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '1rem', color: colors.vino }}>Codigos existentes</h3>
          {codes.length === 0 && <p style={{ color: '#888' }}>No hay codigos creados.</p>}
          {codes.map(function(c) {
            var isLifetime = c.duration_days === 0
            return (
              <div key={c.id} style={{ borderBottom: '1px solid #eee', padding: '0.75rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.1em' }}>{c.code}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', backgroundColor: colors.oro, color: 'white', borderRadius: '12px', padding: '0.15rem 0.5rem' }}>{c.tier}</span>
                    {isLifetime && <span style={{ fontSize: '0.75rem', backgroundColor: colors.verde, color: 'white', borderRadius: '12px', padding: '0.15rem 0.5rem' }}>vitalicio</span>}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
                  {isLifetime ? 'Sin expiracion' : c.duration_days + ' dias'} | {c.current_redemptions}/{c.max_redemptions} usos
                </div>
              </div>
            )
          })}
        </div>
        <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: colors.vino }}>Volver a la app</a>
      </div>
    </div>
  )
}
