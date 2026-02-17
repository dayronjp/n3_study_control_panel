'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TaskItem } from '@/components/TaskItem';
import { getDayColor, isToday, minutesToHours } from '@/lib/utils';
import { t, type Lang, translations } from '@/lib/i18n';
import { CheckCircle2, Clock } from 'lucide-react';
import type { StudyDay } from '@/lib/types';

interface DayCardProps {
  day: StudyDay;
  index: number;
  onToggle: (dayId: string, taskId: string, checked: boolean) => void;
  lang: Lang;
}

export function DayCard({ day, index, onToggle, lang }: DayCardProps) {
  const colors = getDayColor(day.day_name);
  const today = isToday(day.day_name);

  const completedTasks = day.tasks.filter((t) => t.completed).length;
  const totalTasks = day.tasks.length;
  const completedMinutes = day.tasks
    .filter((t) => t.completed)
    .reduce((s, t) => s + t.minutes, 0);
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const allDone = completedTasks === totalTasks && totalTasks > 0;

  // Translate day name and focus using i18n
  const dayLabel = translations[lang][day.day_name as keyof typeof translations.pt] ?? day.day_name;
  const focusLabel = translations[lang][day.focus as keyof typeof translations.pt] ?? day.focus;
  const todayLabel = t(lang, 'today');
  const tasksLabel = t(lang, 'tasks');
  const doneLabel = t(lang, 'done');

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300
        ${allDone
          ? 'border-white/10 bg-white/[0.04]'
          : today
          ? 'border-white/15 bg-white/[0.05] ring-1 ring-white/10'
          : 'border-white/[0.06] bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]'
        }
        animate-fade-in
      `}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      {allDone && (
        <div className={`absolute inset-0 opacity-[0.04] bg-gradient-to-br ${colors.accent} pointer-events-none`} />
      )}
      {today && !allDone && (
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${colors.accent}`} />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold tracking-wider uppercase ${allDone ? 'text-zinc-400' : today ? 'text-white' : 'text-zinc-400'}`}>
                {dayLabel}
              </span>
              {today && !allDone && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/10 text-white/70">
                  {todayLabel}
                </span>
              )}
            </div>
            <p className={`text-sm font-medium leading-snug ${allDone ? 'text-zinc-400' : 'text-zinc-100'}`}>
              {focusLabel}
            </p>
          </div>

          {allDone ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Badge className={`${colors.badge} border text-[10px] shrink-0`}>
              <Clock className="h-2.5 w-2.5 mr-1" />
              {minutesToHours(day.total_minutes)}
            </Badge>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <Progress
            value={progress}
            className="h-1 bg-white/[0.06]"
            indicatorClassName={allDone ? 'bg-emerald-500' : `bg-gradient-to-r ${colors.accent}`}
          />
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-zinc-600">
              {completedTasks}/{totalTasks} {tasksLabel}
            </span>
            <span className={`text-[11px] font-medium ${allDone ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {allDone
                ? `${minutesToHours(day.total_minutes)} ✓`
                : progress > 0
                ? `${minutesToHours(completedMinutes)} ${doneLabel}`
                : `${progress}%`}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-0.5">
          {day.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              accentColor={colors.accent}
              onToggle={(taskId, checked) => onToggle(day.id, taskId, checked)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}