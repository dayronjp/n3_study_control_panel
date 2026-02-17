import { login } from '@/lib/auth';
import { LoginForm } from '@/components/LoginForm';

interface LoginPageProps {
  searchParams?: { error?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const error = searchParams?.error;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-xl font-bold text-white font-display">
            N3 Study Panel
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Faça login para continuar
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <form action={login} className="space-y-4">
            <LoginForm error={error} />
          </form>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-6">
          JLPT N3 · Controle de estudos pessoal
        </p>
      </div>
    </main>
  );
}