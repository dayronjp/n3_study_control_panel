'use client';

import { useState, useCallback, useEffect } from 'react';
import { DayCard } from '@/components/DayCard';
import { WeekHeader } from '@/components/WeekHeader';
import { SessionGuard } from '@/components/SessionGuard';
import { useLang } from '@/components/LangContext';
import type { WeekData, StudyDay } from '@/lib/types';

interface DashboardProps {
  initialData: WeekData;
}

function normalizeDays(days: StudyDay[]): StudyDay[] {
  return days.map((day) => ({
    ...day,
    completed: day.tasks.length > 0 && day.tasks.every((t) => t.completed),
  }));
}

export function Dashboard({ initialData }: DashboardProps) {
  const { lang } = useLang();
  const [days, setDays] = useState<StudyDay[]>(normalizeDays(initialData.days));

  // Undo stack: stores {dayId, taskId, prevCompleted}
  const [undoStack, setUndoStack] = useState<
    { dayId: string; taskId: string; prevCompleted: boolean }[]
  >([]);
  const [showUndo, setShowUndo] = useState(false);
  const [undoTimer, setUndoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleToggle = useCallback(
    (dayId: string, taskId: string, checked: boolean) => {
      // Save previous state for undo
      setDays((prev) => {
        const prevTask = prev
          .find((d) => d.id === dayId)
          ?.tasks.find((t) => t.id === taskId);
        if (prevTask) {
          setUndoStack((s) => [
            { dayId, taskId, prevCompleted: prevTask.completed },
            ...s.slice(0, 9), // keep max 10
          ]);
          setShowUndo(true);
          if (undoTimer) clearTimeout(undoTimer);
          const timer = setTimeout(() => setShowUndo(false), 6000);
          setUndoTimer(timer);
        }

        return prev.map((day) => {
          if (day.id !== dayId) return day;
          const updatedTasks = day.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: checked } : t
          );
          return {
            ...day,
            tasks: updatedTasks,
            completed: updatedTasks.length > 0 && updatedTasks.every((t) => t.completed),
          };
        });
      });
    },
    [undoTimer]
  );

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const [last, ...rest] = undoStack;
    setUndoStack(rest);
    setShowUndo(rest.length > 0);
    if (undoTimer) clearTimeout(undoTimer);
  
    // Revert UI
    setDays((prev) =>
      prev.map((day) => {
        if (day.id !== last.dayId) return day;
        const updatedTasks = day.tasks.map((t) =>
          t.id === last.taskId ? { ...t, completed: last.prevCompleted } : t
        );
        return {
          ...day,
          tasks: updatedTasks,
          completed: updatedTasks.length > 0 && updatedTasks.every((t) => t.completed),
        };
      })
    );

  // Persist undo to DB via Server Action
  toggleTask(last.taskId, last.prevCompleted);
}, [undoStack, undoTimer, toggleTask]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (undoTimer) clearTimeout(undoTimer); };
  }, [undoTimer]);

  const totalMinutes = days.reduce((sum, d) => sum + d.total_minutes, 0);
  const completedMinutes = days.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.completed).reduce((s, t) => s + t.minutes, 0),
    0
  );
  const weekProgress =
    totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0;
  const streak = days.filter((d) => d.completed).length;

  const liveData: WeekData = {
    ...initialData,
    days,
    totalMinutes,
    completedMinutes,
    weekProgress,
    week: { ...initialData.week, streak },
  };

  const undoLabel = lang === 'ja' ? '元に戻す' : 'Desfazer';

  return (
    <div className="space-y-8">
      <SessionGuard />
      <WeekHeader data={liveData} lang={lang} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {days.map((day, index) => (
          <DayCard
            key={day.id}
            day={day}
            index={index}
            onToggle={handleToggle}
            lang={lang}
          />
        ))}
      </div>

      {/* Undo toast */}
      <div
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-40
          flex items-center gap-3 px-4 py-3
          bg-zinc-800 border border-white/10 rounded-xl shadow-2xl
          transition-all duration-300
          ${showUndo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        <span className="text-sm text-zinc-300">
          {lang === 'ja' ? 'タスクを変更しました' : 'Tarefa alterada'}
        </span>
        <button
          onClick={handleUndo}
          className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
        >
          {undoLabel}
        </button>
      </div>
    </div>
  );
}
