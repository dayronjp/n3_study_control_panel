'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLang } from '@/components/LangContext';
import { t } from '@/lib/i18n';

const SESSION_DURATION = 2 * 60 * 60 * 1000;   // 2 hours
const WARNING_BEFORE   = 5 * 60 * 1000;         // warn 5 min before
const CHECK_INTERVAL   = 30 * 1000;             // check every 30s

const STORAGE_KEY = 'n3_last_activity';

function getLastActivity(): number {
  try {
    return Number(localStorage.getItem(STORAGE_KEY) ?? Date.now());
  } catch {
    return Date.now();
  }
}

function updateActivity() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {}
}

export function SessionGuard() {
  const { lang } = useLang();
  const [status, setStatus] = useState<'ok' | 'warning' | 'expired'>('ok');

  const check = useCallback(() => {
    const idle = Date.now() - getLastActivity();
    if (idle >= SESSION_DURATION) {
      setStatus('expired');
    } else if (idle >= SESSION_DURATION - WARNING_BEFORE) {
      setStatus('warning');
    } else {
      setStatus('ok');
    }
  }, []);

  useEffect(() => {
    updateActivity();

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const onActivity = () => {
      updateActivity();
      setStatus('ok');
    };

    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    const interval = setInterval(check, CHECK_INTERVAL);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      clearInterval(interval);
    };
  }, [check]);

  if (status === 'ok') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="space-y-1">
          <h2 className={`text-base font-semibold ${status === 'expired' ? 'text-red-400' : 'text-amber-400'}`}>
            {status === 'expired' ? t(lang, 'sessionExpiredTitle') : t(lang, 'sessionWarningTitle')}
          </h2>
          <p className="text-sm text-zinc-400">
            {status === 'expired' ? t(lang, 'sessionExpiredDesc') : t(lang, 'sessionWarningDesc')}
          </p>
        </div>

        {status === 'expired' ? (
          <button
            onClick={() => { window.location.href = '/login'; }}
            className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            {t(lang, 'sessionExpiredBtn')}
          </button>
        ) : (
          <button
            onClick={() => { updateActivity(); setStatus('ok'); }}
            className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
          >
            {t(lang, 'sessionWarningBtn')}
          </button>
        )}
      </div>
    </div>
  );
}