import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const db = await getDatabase();
        const logs = await db.collection("logs").find({}).sort({ timestamp: -1 }).toArray();
        return NextResponse.json(logs);
    } catch (error) {
        console.error("Failed to fetch logs:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("discord_user");
        if (!userCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const loggedInUser = JSON.parse(userCookie.value);

        const body = await req.json();
        const { targetUser, type, reason, description } = body;

        const db = await getDatabase();
        const newLog = {
            user: {
                name: targetUser || "Unknown",
                avatar: null
            },
            staff: {
                id: loggedInUser.id,
                username: loggedInUser.username
            },
            action: `Issued a ${type}`,
            notes: reason + (description ? `: ${description}` : ""),
            type: type.toLowerCase(),
            timestamp: new Date().toISOString(),
        };

        await db.collection("logs").insertOne(newLog);
        return NextResponse.json({ success: true, log: newLog });
    } catch (error) {
        console.error("Failed to create log:", error);
        return NextResponse.json({ error: "Failed to create log" }, { status: 500 });
    }
}
