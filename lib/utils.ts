import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function minutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function getDayColor(dayName: string): {
  accent: string;
  badge: string;
  glow: string;
} {
  const colors: Record<string, { accent: string; badge: string; glow: string }> = {
    Segunda: {
      accent: 'from-violet-500 to-violet-600',
      badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      glow: 'shadow-violet-500/20',
    },
    Terça: {
      accent: 'from-blue-500 to-blue-600',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      glow: 'shadow-blue-500/20',
    },
    Quarta: {
      accent: 'from-emerald-500 to-emerald-600',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
    },
    Quinta: {
      accent: 'from-amber-500 to-amber-600',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      glow: 'shadow-amber-500/20',
    },
    Sexta: {
      accent: 'from-rose-500 to-rose-600',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      glow: 'shadow-rose-500/20',
    },
    Sábado: {
      accent: 'from-orange-500 to-orange-600',
      badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
      glow: 'shadow-orange-500/20',
    },
  };
  return colors[dayName] ?? colors['Segunda'];
}

export function isToday(dayName: string): boolean {
  const dayMap: Record<number, string> = {
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
    6: 'Sábado',
  };
  const today = new Date().getDay();
  return dayMap[today] === dayName;
}
