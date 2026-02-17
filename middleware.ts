import { NextResponse } from 'next/server';

export function middleware(request: any) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get('cookie') ?? '';
  const hasSessionCookie = cookieHeader.includes('n3study_session');

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};