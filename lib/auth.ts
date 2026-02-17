export const runtime = 'nodejs';

import { scryptSync, timingSafeEqual } from 'crypto';
import { redirect } from 'next/navigation';
import { sql } from './db';
import { getSession } from './session';

function verifyPassword(password: string, stored: string): boolean {
  const [salt, storedHash] = stored.split(':');
  if (!salt || !storedHash) return false;
  try {
    const hash = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
  } catch {
    return false;
  }
}

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const name = String(formData.get('name') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!name || !password) {
    return { error: 'Preencha todos os campos.' };
  }

  const rows = await sql`
    SELECT id, name, password_hash FROM users
    WHERE name = ${name}
    LIMIT 1
  `;

  if (rows.length === 0) {
    return { error: 'Usuário ou senha incorretos.' };
  }

  const user = rows[0];

  if (!user.password_hash) {
    return { error: 'Usuário sem senha configurada.' };
  }

  const valid = verifyPassword(password, String(user.password_hash));

  if (!valid) {
    return { error: 'Usuário ou senha incorretos.' };
  }

  const session = await getSession();
  session.user = { id: Number(user.id), name: String(user.name) };
  await session.save();

  redirect('/');
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect('/login');
}