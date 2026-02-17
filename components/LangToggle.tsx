'use client';

import { useLang } from '@/components/LangContext';

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === 'ja' ? 'pt' : 'ja')}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
      title={lang === 'ja' ? 'Mudar para Português' : '日本語に切り替え'}
    >
      <span className="text-xs font-medium text-zinc-300">
        {lang === 'ja' ? '日本語' : 'PT'}
      </span>
      <span className="text-zinc-600 text-xs">→</span>
      <span className="text-xs text-zinc-500">
        {lang === 'ja' ? 'PT' : '日本語'}
      </span>
    </button>
  );
}