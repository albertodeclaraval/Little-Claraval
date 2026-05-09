import './globals.css'

export const metadata = {
  title: 'Little Claraval',
  description: 'Contenido liturgico catolico diario',
  manifest: '/manifest.json',
  themeColor: '#782F40',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Little Claraval',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: "if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js') }"
          }}
        />
      </body>
    </html>
  )
}
