import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'n3study_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and static assets through
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Check session cookie directly from request headers
  const cookieHeader = request.headers.get('cookie') ?? '';
  const hasSessionCookie = cookieHeader.includes('n3study_session');

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Validate session content using iron-session
  try {
    // We read the cookie manually here since iron-session needs the full request/response
    const response = NextResponse.next();
    const session = await getIronSession<{ user?: { id: number; name: string } }>(
      request,
      response,
      sessionOptions
    );

    if (!session.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};