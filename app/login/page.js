'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const colors = {
  pergamino: '#F8F1E6',
  vino: '#782F40',
  oro: '#B4903E',
  verde: '#4B643C',
  texto: '#2C1810',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [modo, setModo] = useState('login')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit() {
    if (modo === 'registro' && password !== confirmar) {
      setMensaje('Error: Las contraseñas no coinciden.')
      return
    }
    setCargando(true)
    setMensaje('')

    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMensaje('Error: ' + error.message)
      } else {
        window.location.href = '/'
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMensaje('Error: ' + error.message)
      } else {
        setMensaje('¡Cuenta creada! Revisa tu correo para confirmar.')
      }
    }
    setCargando(false)
  }

  return (
    <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: colors.vino, fontWeight: 'bold', marginBottom: '0.25rem' }}>✝ Little Claraval</div>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>{modo === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta gratuita'}</p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: colors.texto, marginBottom: '0.35rem', fontWeight: 'bold' }}>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' }}
            placeholder="tu@correo.com"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: colors.texto, marginBottom: '0.35rem', fontWeight: 'bold' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' }}
            placeholder="••••••••"
          />
        </div>

        {modo === 'registro' && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: colors.texto, marginBottom: '0.35rem', fontWeight: 'bold' }}>Confirmar contraseña</label>
            <input
              type="password"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              autoComplete="new-password"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' }}
              placeholder="••••••••"
            />
          </div>
        )}

        {mensaje && (
          <div style={{ backgroundColor: mensaje.includes('Error') ? '#fee2e2' : '#dcfce7', color: mensaje.includes('Error') ? '#991b1b' : '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {mensaje}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={cargando}
          style={{ width: '100%', backgroundColor: colors.vino, color: 'white', border: 'none', borderRadius: '6px', padding: '0.85rem', fontSize: '0.95rem', cursor: 'pointer', marginBottom: '1rem' }}
        >
          {cargando ? 'Cargando...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888' }}>
          {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <span
            onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setMensaje(''); setConfirmar('') }}
            style={{ color: colors.vino, cursor: 'pointer', fontWeight: 'bold' }}
          >
            {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </p>

      </div>
    </div>
  )
}
