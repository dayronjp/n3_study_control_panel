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
                { status: 500}
            );
        }

        if (!apiKey || apiKey !== expectedKey) {
            return unauthorized();
        }

        const weekStart = getWeekStart();
        const WeekStartStr = weekStart.toISOString().split('T')[0];

    } catch (error) {
        
    }
}