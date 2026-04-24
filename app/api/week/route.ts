import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getWeekStart } from "@/lib/study-plan";

function unauthorized() {
    return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or not included API KEY" },
        { status: 401 }
    );
}

export async function GET(request: Request) {
    try {
        const apiKey = request.headers.get("x-api-key");
        const expectedKey = process.env.STUDY_API_KEY;

        if (!expectedKey) {
            return NextResponse.json(
                { error: "Server misconfigured", message: "ApiKey not configured" },
                { status: 500 }
            );
        }

        if (!apiKey || apiKey !== expectedKey) {
            return unauthorized();
        }

        const weekStart = getWeekStart();
        const weekStartStr = weekStart.toISOString().split('T')[0];

        const weeks = await sql `
        SELECT id, streak FROM study_weeks
        WHERE week_start = ${weekStartStr}
        LIMIT 1
        `;

        if (weeks.length === 0) {
            return NextResponse.json({
                error: 'Week not found',
                message: 'Nenhuma semana encontrada. Acesse o painel primeiro para criar'
        }, { status: 404 });
        }

        const week = weeks[0];
        const weekId = Number(week.id);

        const days = await sql `
        SELECT id, day_name, focus, total_minutes, completed
        FROM study_days
        WHERE week_id = ${weekId}
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

        const tasks = await sql `
        SELECT t.id, t.study_day_id, t.title, t.minutes, t.completed
        FROM tasks t
        INNER JOIN study_days sd ON t.study_day_id = sd.id
        WHERE sd.week_id = ${weekId}
        ORDER BY sd.id, t.id
        `;

        const schedule = days.map((day) => {
            const dayId = Number(day.id);
            const dayTasks = tasks
            .filter((t) => Number(t.study_day_id) === dayId)
            .map((t) => ({
                id: String(t.id),
                title: String(t.title),
                minutes:Number(t.minutes),
                completed: Boolean(t.completed),
            })); 

            const completedTasks = dayTasks.filter((t) => t.completed).length;
            const totalTasks = dayTasks.length;
            const completedMinutes = dayTasks
            .filter((t) => t.completed)
            .reduce((sum, t) => sum + t.minutes, 0);

            return {
                day: String(day.day_name),
                focus: String(day.focus),
                stats: {
                    totalMinutes: Number(day.total_minutes),
                    completedMinutes,
                    progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100): 0,
                    completedTasks,
                    totalTasks,
                    isCompleted: Boolean(day.completed),
                },
                tasks: dayTasks,
            };
        });

        const totalMinutes = days.reduce((sum, d) => sum + Number(d.total_minutes), 0);
        const completedMinutes = schedule.reduce((sum, d) => sum + d.stats.completedMinutes, 0);
        const completedDays = days.filter((d) => Boolean(d.completed)).length;

        return NextResponse.json({
            weekStart: weekStartStr,
            weekEnd: new Date(new Date(weekStartStr).getTime() + 5 * 24 * 60 * 60 * 1000)
             .toISOString()
             .split('T')[0],
            stats: {
                totalMinutes,
                completedMinutes,
                weekProgress: totalMinutes > 0 ? Math.round((completedMinutes / totalMinutes) * 100) : 0,
                completedDays,
                totalDays: days.length,
                streak: Number(week.streak),
            },
            schedule,
        });
    } catch (error) {
        console.error('[API /week] Error:', error);
        return NextResponse.json(
        { error: 'Internal server error', message: String(error) },
        { status: 500 }
        );
    }
}