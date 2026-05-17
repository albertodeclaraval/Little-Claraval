'use client'

var colors = { pergamino: '#F8F1E6', vino: '#782F40', oro: '#B4903E', texto: '#2C1810', verde: '#4B643C' }

export default function LecturasAdminPage() {
  return (
    <div style={{ backgroundColor: colors.pergamino, minHeight: '100vh', fontFamily: 'Georgia, serif', color: colors.texto, padding: '1.5rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <h1 style={{ color: colors.vino, fontSize: '1.4rem', margin: 0 }}>Editor de Lecturas</h1>
          <a href="/admin" style={{ fontSize: '0.8rem', color: colors.vino, textDecoration: 'none' }}>← Volver al admin</a>
        </div>
        <div style={{ backgroundColor: '#fdf8f0', border: '2px solid ' + colors.oro, borderRadius: '8px', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: colors.oro, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            Módulo migrado
          </div>
          <p style={{ lineHeight: 1.7, color: colors.texto, margin: '0 0 0.75rem' }}>
            Las lecturas y reflexiones se gestionan ahora desde el <strong>Excel MASTER</strong> y se importan a través del panel de importación.
          </p>
          <p style={{ lineHeight: 1.7, color: '#888', fontSize: '0.9rem', margin: 0 }}>
            La edición manual por fecha ya no está disponible. Usa <a href="/admin/importar" style={{ color: colors.vino }}>Admin → Importar</a> para cargar lecturas desde el Excel.
          </p>
        </div>
      </div>
    </div>
  )
}
