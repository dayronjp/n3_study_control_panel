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
    try{
        const apiKey = request.headers.get("x-api-key");
        const expectedKey = process.env.STUDY_API_KEY;

        if (!expectedKey) {
            return NextResponse.json(
                { error: "Server misconfigured", message: "ApiKey not configured" },
                {status: 500 }
            );
        }

        if (!apiKey || apiKey !== expectedKey) {
            return unauthorized();
        }

        const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const today = dayNames[new Date().getDay()];

        if (today === 'Domingo') {
            return NextResponse.json({
                error: 'No schedule for Sundays',
                message: `O cronograma semanal vai de segunda a sábado`,
            }, {status: 404});
        }

        const weekStart = getWeekStart();
        const WeekStartStr = weekStart.toISOString().split('T')[0];

        const weeks = await sql `
            SELECT id FROM study_weeks
            WHERE week_start = ${WeekStartStr}
            LIMIT 1
        `;

        if (weeks.length === 0) {
            return NextResponse.json({
                error: 'Week not found',
                message: `Nenhuma semana encontrada para esta data. Acesse o painel primeiro. `,
            }, {status: 404 });
        }

        const weekId = Number(weeks[0].id);

        const days = await sql `
            SELECT id, day_name, focus, total_minutes, completed
            FROM study_days
            WHERE week_id = ${weekId} AND day_name = ${today}
            LIMIT 1
        `;

        if (days.length === 0) {
            return NextResponse.json({
                error: 'Day not found',
                message: `Day ${today} not found in this week`,
            }, {status: 404 });
        }

        const day = days[0];
        const dayId = Number(day.id);

        const tasks = await sql `
        SELECT id, title, minutes, completed
        FROM tasks
        WHERE study_day_id = ${dayId}
        ORDER BY id
        `;

        const completedTasks = tasks.filter((t) => Boolean(t.completed)).length;
        const totalTasks = tasks.length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;


        const completedMinutes = tasks
        .filter((t) => Boolean(t.completed))
        .reduce((sum, t) => sum + Number(t.minutes), 0);

        return NextResponse.json({
            day: String(day.day_name),
            focus: String(day.focus),
            date: new Date().toISOString().split('T')[0],
            weekStart: WeekStartStr,
            stats: {
                totalMinutes: Number(day.total_minutes),
                completedMinutes,
                progress,
                completedTasks,
                totalTasks,
                isCompleted: Boolean(day.completed),
            },
            tasks: tasks.map((t) => ({
                id: String(t.id),
                title: String(t.title),
                minutes: Number(t.minutes),
                completed: Boolean(t.completed),
            })),
        });
    } catch (error) {
        console.error('[API /today] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: String(error) },
            { status: 500 }
        );
    }
}