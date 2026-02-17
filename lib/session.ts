import { getIronSession, type IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';

// Extend iron-session types
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      name: string;
    };
  }
}

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'n3study_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hours — matches SessionGuard client timeout
  },
};

export async function getSession() {
  const session = await getIronSession<IronSessionData>(
    cookies(),
    sessionOptions
  );
  return session;
}