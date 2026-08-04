import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // This app uses Firebase client-side auth and does not set NextAuth/session cookies.
  // Redirecting protected routes from middleware causes false "not logged in" loops.
  // Route protection is handled in client hooks/components (useUser/useRequireAuth).
  const hasLegacySessionCookie =
    request.cookies.has('__Secure-next-auth.session-token') ||
    request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__session');

  // Keep legacy behavior only when a server-side session cookie actually exists.
  if (path === '/login' && hasLegacySessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
