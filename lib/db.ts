import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL);

const DELAY_MS = 800;
const MAX_RETRIES = 3;

async function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Tagged template literal wrapper with retry for Neon cold starts
export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await client(strings, ...values) as Record<string, unknown>[];
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient =
        msg.includes('fetch failed') ||
        msg.includes('Error connecting') ||
        msg.includes('ECONNRESET') ||
        msg.includes('socket hang up');

      if (isTransient && attempt < MAX_RETRIES) {
        console.warn(`[db] attempt ${attempt} failed, retrying in ${DELAY_MS * attempt}ms...`);
        await wait(DELAY_MS * attempt);
        continue;
      }
      throw err;
    }
  }
  // unreachable but satisfies TypeScript
  return [];
}