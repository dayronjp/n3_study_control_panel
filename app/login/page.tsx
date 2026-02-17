import { login } from '@/lib/auth';
import { LoginForm } from '@/components/LoginForm';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            N3 Study Panel
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Faça login para continuar
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <LoginForm action={login} />
        </div>
      </div>
    </main>
  );
}