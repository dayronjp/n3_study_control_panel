'use client';

import { useState, useTransition } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { toggleTask } from '@/lib/actions';
import { minutesToHours } from '@/lib/utils';
import type { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  accentColor: string;
  onToggle: (taskId: string, checked: boolean) => void;
}

export function TaskItem({ task, accentColor, onToggle }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(checked: boolean) {
    // Update UI immediately (optimistic)
    onToggle(task.id, checked);
    // Persist to DB in background
    startTransition(async () => {
      await toggleTask(task.id, checked);
    });
  }

  return (
    <div
      className={`
        flex items-center gap-3 py-2 px-3 rounded-lg
        transition-all duration-150
        ${task.completed ? 'opacity-60' : 'hover:bg-white/[0.03]'}
        ${isPending ? 'opacity-70' : ''}
      `}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleChange}
        className={
          task.completed
            ? `data-[state=checked]:bg-gradient-to-br ${accentColor} data-[state=checked]:border-0`
            : ''
        }
      />
      <span
        className={`
          text-sm flex-1 transition-all duration-150
          ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-300'}
        `}
      >
        {task.title}
      </span>
      <span className="text-xs text-zinc-600 tabular-nums shrink-0">
        {minutesToHours(task.minutes)}
      </span>
    </div>
  );
}