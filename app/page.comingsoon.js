export default function ComingSoon() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F1E6',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✝</div>
      <h1 style={{ color: '#782F40', fontSize: '2.5rem', margin: '0 0 0.5rem 0', letterSpacing: '0.1em' }}>
        Little Claraval
      </h1>
      <p style={{ color: '#B4903E', fontSize: '1.1rem', fontStyle: 'italic', margin: '0 0 2rem 0' }}>
        Contenido litúrgico católico diario
      </p>
      <div style={{ background: '#782F40', color: '#F8F1E6', padding: '1rem 2.5rem', borderRadius: '8px', fontSize: '1.2rem' }}>
        Próximamente
      </div>
      <p style={{ color: '#2C1810', marginTop: '2rem', fontSize: '0.95rem', maxWidth: '400px', lineHeight: '1.6' }}>
        Estamos preparando algo hermoso para ti. Evangelio, reflexiones, santos, journals espirituales y más.
      </p>
      <p style={{ color: '#B4903E', marginTop: '3rem', fontSize: '0.85rem' }}>Via Claraval</p>
    </div>
  );
}
