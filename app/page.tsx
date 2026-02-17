import { getWeekData } from '@/lib/actions';
import { Dashboard } from '@/components/Dashboard';
import { getSession } from '@/lib/session';
import { logout } from '@/lib/auth';
import { LangProvider } from '@/components/LangContext';
import { LangToggle } from '@/components/LangToggle';
import { BookOpen, LogOut } from 'lucide-react';
import { Torii } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [data, session] = await Promise.all([getWeekData(), getSession()]);

  return (
    <LangProvider>
      <main className="min-h-screen">
        <nav className="border-b border-white/[0.05] bg-black/40 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <BookOpen className="h-3.5 w-3.5 text-violet-400" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight font-display">
                N3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LangToggle />
              {session.user && (
                <span className="text-xs text-zinc-500 hidden sm:block">{session.user.name}</span>
              )}
              <form action={logout}>
                <button
                  type="submit"
                  title="Sair"
                  className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.05]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Dashboard initialData={data} />
        </div>
      </main>
    </LangProvider>
  );
}