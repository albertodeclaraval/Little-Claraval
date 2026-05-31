'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

var colors = { vino: '#782F40', pergamino: '#F8F1E6', texto: '#2C1810' }

var TL = {
  es: {
    title: 'Little Claraval',
    loginSubtitle: 'Inicia sesion en tu cuenta',
    registerSubtitle: 'Crea tu cuenta gratuita',
    email: 'Correo electronico', emailPlaceholder: 'tu@correo.com',
    password: 'Contrasena', confirmPassword: 'Confirmar contrasena',
    loginBtn: 'Iniciar sesion', registerBtn: 'Crear cuenta',
    loading: 'Cargando...',
    noAccount: 'No tienes cuenta?', hasAccount: 'Ya tienes cuenta?',
    register: 'Registrate', login: 'Inicia sesion',
    passwordMismatch: 'Error: Las contrasenas no coinciden.',
    preferredLang: 'Idioma preferido',
  },
  en: {
    title: 'Little Claraval',
    loginSubtitle: 'Sign in to your account',
    registerSubtitle: 'Create your free account',
    email: 'Email address', emailPlaceholder: 'you@email.com',
    password: 'Password', confirmPassword: 'Confirm password',
    loginBtn: 'Sign in', registerBtn: 'Create account',
    loading: 'Loading...',
    noAccount: "Don't have an account?", hasAccount: 'Already have an account?',
    register: 'Register', login: 'Sign in',
    passwordMismatch: 'Error: Passwords do not match.',
    preferredLang: 'Preferred language',
  },
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [modo, setModo] = useState('login')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [lang, setLangState] = useState('es')

  useEffect(function() {
    try {
      var saved = localStorage.getItem('lc_lang')
      if (saved === 'es' || saved === 'en') setLangState(saved)
    } catch(e) {}
  }, [])

  function changeLang(l) {
    setLangState(l)
    try { localStorage.setItem('lc_lang', l) } catch(e) {}
  }

  var t = TL[lang] || TL.es

  async function handleSubmit() {
    if (modo === 'registro' && password !== confirmar) {
      setMensaje(t.passwordMismatch)
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
        setMensaje(lang === 'en' ? 'Account created. Check your email to confirm.' : 'Cuenta creada. Revisa tu correo para confirmar.')
      }
    }
    setCargando(false)
  }

  var pillBtn = function(active) {
    return {
      background: active ? colors.vino : 'transparent',
      color: active ? 'white' : colors.vino,
      border: '1px solid ' + colors.vino,
      padding: '0.22rem 0.6rem', cursor: 'pointer',
      fontFamily: 'Georgia, serif', fontSize: '0.75rem', fontWeight: active ? 'bold' : 'normal',
    }
  }

  return (
    <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

        {/* Header with lang toggle */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: colors.vino, fontWeight: 'bold', marginBottom: '0.25rem' }}>{t.title}</div>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>{modo === 'login' ? t.loginSubtitle : t.registerSubtitle}</p>
          {/* Language toggle */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', borderRadius: '20px', overflow: 'hidden', border: '1px solid ' + colors.vino }}>
              <button style={pillBtn(lang === 'es')} onClick={function() { changeLang('es') }}>ES</button>
              <button style={pillBtn(lang === 'en')} onClick={function() { changeLang('en') }}>EN</button>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t.email}</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' }} placeholder={t.emailPlaceholder} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t.password}</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={modo === 'login' ? 'current-password' : 'new-password'} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' }} placeholder="........" />
        </div>
        {modo === 'registro' && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t.confirmPassword}</label>
            <input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)} autoComplete="new-password" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', boxSizing: 'border-box' }} placeholder="........" />
          </div>
        )}
        {mensaje && (
          <div style={{ backgroundColor: mensaje.includes('Error') ? '#fee2e2' : '#dcfce7', color: mensaje.includes('Error') ? '#991b1b' : '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {mensaje}
          </div>
        )}
        <button onClick={handleSubmit} disabled={cargando} style={{ width: '100%', backgroundColor: colors.vino, color: 'white', border: 'none', borderRadius: '6px', padding: '0.85rem', fontSize: '0.95rem', cursor: 'pointer', marginBottom: '1rem' }}>
          {cargando ? t.loading : modo === 'login' ? t.loginBtn : t.registerBtn}
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#888' }}>
          {modo === 'login' ? t.noAccount : t.hasAccount}{' '}
          <span onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setMensaje(''); setConfirmar('') }} style={{ color: colors.vino, cursor: 'pointer', fontWeight: 'bold' }}>
            {modo === 'login' ? t.register : t.login}
          </span>
        </p>
      </div>
    </div>
  )
}
