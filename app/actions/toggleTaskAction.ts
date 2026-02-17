'use server';

import { toggleTask } from '@/lib/actions';

export async function toggleTaskAction(
  taskId: string,
  completed: boolean
) {
  await toggleTask(taskId, completed);
}