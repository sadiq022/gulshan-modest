import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hasMockCookie = request.cookies.get('mock-admin-logged-in')?.value === 'true'
  
  // Check if any supabase auth cookie exists (standard naming format is sb-<project-id>-auth-token)
  const hasSupabaseCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  const loggedIn = hasMockCookie || hasSupabaseCookie

  // Protected paths
  const isProtectedPath =
    request.nextUrl.pathname.startsWith('/account') ||
    request.nextUrl.pathname.startsWith('/checkout')
  const isAdminPath =
    request.nextUrl.pathname.startsWith('/admin') &&
    request.nextUrl.pathname !== '/admin/login'

  if ((isProtectedPath || isAdminPath) && !loggedIn) {
    const url = request.nextUrl.clone()
    if (isAdminPath) {
      url.pathname = '/admin/login'
    } else {
      url.pathname = '/admin/login' // fallback to admin login for now
      url.searchParams.set('redirect', request.nextUrl.pathname)
    }
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
