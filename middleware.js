import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Rutas publicas que no requieren login
  const publicRoutes = ['/login', '/api/webhooks/lemonsqueezy']

  // No proteger rutas publicas ni archivos estaticos
  if (publicRoutes.some(route => pathname.startsWith(route)) ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  // Verificar si hay sesion de Supabase
  const supabaseAuth = request.cookies.get('sb-rsbhlglnrrivqdbtrzqj-auth-token') ||
                        request.cookies.get('sb-rsbhlglnrrivqdbtrzqj-auth-token.0')

  if (!supabaseAuth) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
