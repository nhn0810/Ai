import { createClient } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is not signed in and the current path is not /login, redirect the user to /login
  if (!user && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // if user is signed in and the current path is /login, redirect the user to /
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user.id)
      .single();

    // If user is signed in but has no nickname, and is not on the welcome page, redirect to /welcome
    if (!profile?.nickname && request.nextUrl.pathname !== '/welcome') {
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
  }


  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}
