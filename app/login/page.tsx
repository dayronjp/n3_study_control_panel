'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/lib/auth';
import { BookOpen, LogIn, Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="
        w-full flex items-center justify-center gap-2
        bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed
        text-white text-sm font-medium
        py-2.5 rounded-lg
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-violet-500/50
      "
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}

export default function LoginPage() {
  const [state, action] = useFormState(login, null);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-white font-display">
            N3 Study Panel
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Faça login para continuar</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <form action={action} className="space-y-4">
            {state?.error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                {state.error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Usuário
              </label>
              <input
                name="name"
                type="text"
                required
                autoComplete="username"
                autoFocus
                placeholder="seu nome de usuário"
                className="
                  w-full bg-white/[0.04] border border-white/[0.08] rounded-lg
                  px-3 py-2.5 text-sm text-white placeholder:text-zinc-600
                  focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30
                  transition-all duration-150
                "
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Senha
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="
                  w-full bg-white/[0.04] border border-white/[0.08] rounded-lg
                  px-3 py-2.5 text-sm text-white placeholder:text-zinc-600
                  focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30
                  transition-all duration-150
                "
              />
            </div>

            <SubmitButton />
          </form>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-6">
          JLPT N3 · Controle de estudos pessoal
        </p>
      </div>
    </main>
  );
}