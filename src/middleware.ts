import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lindungi semua rute yang dimulai dengan /dashboard
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get('mediagnotek_session')?.value;
    const authToken = request.cookies.get('mediagnotek_auth_token')?.value;

    // Jika tidak ada cookie sesi yang valid, alihkan langsung ke /login dengan callback URL
    if (!sessionCookie && !authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika sudah login dan mencoba mengakses /login atau /register, arahkan ke /dashboard
  if (pathname === '/login' || pathname === '/register') {
    const sessionCookie = request.cookies.get('mediagnotek_session')?.value;
    const authToken = request.cookies.get('mediagnotek_auth_token')?.value;

    if (sessionCookie || authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
};
