'use server';

import { scryptSync, timingSafeEqual } from 'crypto';
import { redirect } from 'next/navigation';
import { sql } from './db';
import { getSession } from './session';

function verifyPassword(password: string, stored: string): boolean {
  const [salt, storedHash] = stored.split(':');
  if (!salt || !storedHash) return false;

  try {
    const hash = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(storedHash, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Server Action usada diretamente em <form action={login}>
 */
export async function login(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!name || !password) {
    redirect('/login?error=1');
  }

  const rows = await sql`
    SELECT id, name, password_hash
    FROM users
    WHERE name = ${name}
    LIMIT 1
  `;

  if (rows.length === 0) {
    redirect('/login?error=1');
  }

  const user = rows[0];

  if (!user.password_hash) {
    redirect('/login?error=1');
  }

  const valid = verifyPassword(password, String(user.password_hash));

  if (!valid) {
    redirect('/login?error=1');
  }

  const session = await getSession();
  session.user = {
    id: Number(user.id),
    name: String(user.name),
  };

  await session.save();

  redirect('/');
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect('/login');
}