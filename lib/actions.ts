'use server';

import { sql } from './db';
import { WEEKLY_PLAN, getWeekStart } from './study-plan';
import type { WeekData, StudyDay } from './types';

function toDateStr(val: unknown): string {
  if (val instanceof Date) return val.toISOString().split('T')[0];
  return String(val).split('T')[0];
}

function toISOStr(val: unknown): string {
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

async function getOrCreateUser(): Promise<number> {
  const rows = await sql`SELECT id FROM users LIMIT 1`;
  if (rows.length > 0) return Number(rows[0].id);
  const created = await sql`INSERT INTO users (name) VALUES ('Estudante') RETURNING id`;
  return Number(created[0].id);
}

async function getOrCreateWeek(userId: number): Promise<number> {
  const weekStart = getWeekStart();
  const weekStartStr = weekStart.toISOString().split('T')[0];

  // Always get the LATEST week for this user+date to avoid reading stale duplicates
  const existing = await sql`
    SELECT MAX(id) as id FROM study_weeks
    WHERE user_id = ${userId} AND week_start = ${weekStartStr}
  `;
  const existingId = existing[0]?.id ? Number(existing[0].id) : null;
  if (existingId) return existingId;

  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeekStr = prevWeekStart.toISOString().split('T')[0];

  const prevWeek = await sql`
    SELECT MAX(id) as id, MAX(streak) as streak FROM study_weeks
    WHERE user_id = ${userId} AND week_start = ${prevWeekStr}
  `;

  let streak = 0;
  const prevWeekId = prevWeek[0]?.id ? Number(prevWeek[0].id) : null;
  if (prevWeekId) {
    const prevWeekDays = await sql`
      SELECT COUNT(*) as count FROM study_days
      WHERE week_id = ${prevWeekId} AND completed = TRUE
    `;
    if (Number(prevWeekDays[0].count) > 0) {
      streak = Number(prevWeek[0].streak) + 1;
    }
  }

  // Use INSERT ... ON CONFLICT DO NOTHING to prevent race-condition duplicates
  // Then fetch the id (whether we inserted or another request beat us to it)
  await sql`
    INSERT INTO study_weeks (user_id, week_start, streak)
    VALUES (${userId}, ${weekStartStr}, ${streak})
    ON CONFLICT DO NOTHING
  `;

  const weekRow = await sql`
    SELECT MAX(id) as id FROM study_weeks
    WHERE user_id = ${userId} AND week_start = ${weekStartStr}
  `;
  const weekId = Number(weekRow[0].id);

  // Only insert days/tasks if this week has none yet
  const existingDays = await sql`
    SELECT COUNT(*) as count FROM study_days WHERE week_id = ${weekId}
  `;
  if (Number(existingDays[0].count) > 0) return weekId;

  for (const day of WEEKLY_PLAN) {
    const newDay = await sql`
      INSERT INTO study_days (week_id, day_name, focus, total_minutes)
      VALUES (${weekId}, ${day.dayName}, ${day.focus}, ${day.totalMinutes})
      RETURNING id
    `;
    const dayId = Number(newDay[0].id);
    for (const task of day.tasks) {
      await sql`
        INSERT INTO tasks (study_day_id, title, minutes)
        VALUES (${dayId}, ${task.title}, ${task.minutes})
      `;
    }
  }

  return weekId;
}

export async function getWeekData(userId: number): Promise<WeekData> {
  const weekId = await getOrCreateWeek(userId);

  const weekRows = await sql`
    SELECT * FROM study_weeks WHERE id = ${weekId} AND user_id = ${userId}
  `;
  const week = weekRows[0];

  const dayRows = await sql`
    SELECT * FROM study_days WHERE week_id = ${weekId}
    ORDER BY CASE day_name
      WHEN 'Segunda' THEN 1
      WHEN 'Terça'   THEN 2
      WHEN 'Quarta'  THEN 3
      WHEN 'Quinta'  THEN 4
      WHEN 'Sexta'   THEN 5
      WHEN 'Sábado'  THEN 6
      ELSE 7
    END
  `;

  const taskRows = await sql`
    SELECT t.* FROM tasks t
    INNER JOIN study_days sd ON t.study_day_id = sd.id
    WHERE sd.week_id = ${weekId}
  `;

  const days: StudyDay[] = dayRows.map((d) => {
    const dayId = Number(d.id);
    const dayTasks = taskRows
      .filter((t) => Number(t.study_day_id) === dayId)
      .map((t) => ({
        id: String(Number(t.id)),
        study_day_id: String(Number(t.study_day_id)),
        title: String(t.title),
        minutes: Number(t.minutes),
        completed: Boolean(t.completed),
      }));

    const completed = dayTasks.length > 0 && dayTasks.every((t) => t.completed);

    return {
      id: String(dayId),
      week_id: String(Number(d.week_id)),
      day_name: String(d.day_name),
      focus: String(d.focus),
      completed,
      total_minutes: Number(d.total_minutes),
      tasks: dayTasks,
    };
  });

  const totalMinutes = days.reduce((sum, d) => sum + d.total_minutes, 0);
  const completedMinutes = days.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.completed).reduce((s, t) => s + t.minutes, 0),
    0
  );
  const weekProgress =
    totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0;

  return {
    week: {
      id: String(Number(week.id)),
      user_id: String(Number(week.user_id)),
      week_start: toDateStr(week.week_start),
      streak: Number(week.streak),
      created_at: toISOStr(week.created_at),
    },
    days,
    totalMinutes,
    completedMinutes,
    weekProgress,
  };
}

export async function toggleTask(taskId: string, completed: boolean) {
  const id = Number(taskId);

  await sql`UPDATE tasks SET completed = ${completed} WHERE id = ${id}`;

  const taskRows = await sql`SELECT study_day_id FROM tasks WHERE id = ${id}`;
  if (taskRows.length === 0) return;

  const dayId = Number(taskRows[0].study_day_id);
  const tasks = await sql`SELECT completed FROM tasks WHERE study_day_id = ${dayId}`;
  const allDone = tasks.length > 0 && tasks.every((t) => Boolean(t.completed));
  await sql`UPDATE study_days SET completed = ${allDone} WHERE id = ${dayId}`;

  const dayRows = await sql`SELECT week_id FROM study_days WHERE id = ${dayId}`;
  if (dayRows.length > 0) {
    const weekId = Number(dayRows[0].week_id);
    const wDays = await sql`SELECT completed FROM study_days WHERE week_id = ${weekId}`;
    const completedCount = wDays.filter((d) => Boolean(d.completed)).length;
    await sql`UPDATE study_weeks SET streak = ${completedCount} WHERE id = ${weekId}`;
  }
}