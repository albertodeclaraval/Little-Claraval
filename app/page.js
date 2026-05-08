export default function Home() {
  return (
    <main style={{
      backgroundColor: '#F8F1E6',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      color: '#782F40'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
        Little Claraval
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#4B643C' }}>
        Contenido litúrgico diario — próximamente
      </p>
    </main>
  )
}