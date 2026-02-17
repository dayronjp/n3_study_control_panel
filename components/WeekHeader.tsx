import { Progress } from '@/components/ui/progress';
import { formatWeekRange } from '@/lib/study-plan';
import { minutesToHours } from '@/lib/utils';
import { t, type Lang } from '@/lib/i18n';
import { Flame, Calendar, Clock, TrendingUp } from 'lucide-react';
import type { WeekData } from '@/lib/types';

interface WeekHeaderProps {
  data: WeekData;
  lang: Lang;
}

export function WeekHeader({ data, lang }: WeekHeaderProps) {
  const { week, totalMinutes, completedMinutes, weekProgress } = data;
  const completedDays = data.days.filter((d) => d.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium tracking-widest uppercase text-zinc-500">
              {t(lang, 'jlpt')}
            </span>
            <span className="h-px flex-1 max-w-[40px] bg-zinc-800" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t(lang, 'title')}
          </h1>
          <div className="flex items-center gap-1.5 mt-1.5 text-zinc-500 text-sm">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatWeekRange(week.week_start)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2.5">
          <Flame className="h-5 w-5 text-orange-400" />
          <div>
            <div className="text-lg font-bold text-orange-300 leading-none">
              {week.streak}
            </div>
            <div className="text-[10px] text-orange-400/70 uppercase tracking-wider">
              {t(lang, week.streak === 1 ? 'streakLabelSingle' : 'streakLabel')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              {t(lang, 'progress')}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">{weekProgress}%</div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              {t(lang, 'hours')}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {minutesToHours(completedMinutes)}
            <span className="text-sm text-zinc-600 font-normal ml-1">
              / {minutesToHours(totalMinutes)}
            </span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              {t(lang, 'days')}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {completedDays}
            <span className="text-sm text-zinc-600 font-normal ml-1">
              / {data.days.length}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-600">
          <span>{t(lang, 'weeklyProgress')}</span>
          <span className="text-zinc-400 font-medium">{weekProgress}%</span>
        </div>
        <Progress
          value={weekProgress}
          className="h-2 bg-white/[0.05]"
          indicatorClassName="bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500"
        />
      </div>
    </div>
  );
}