import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import { SHIFT_ROLES } from "@/app/config/roles";
import { addDiscordRole } from "@/app/lib/discord";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("discord_user");
        if (!userCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = JSON.parse(userCookie.value);

        const { type } = await req.json();

        if (!type || !["MODERATING", "HR_SUPERVISOR", "FIFTY_FIFTY"].includes(type)) {
            return NextResponse.json({ error: "Invalid shift type" }, { status: 400 });
        }

        const db = await getDatabase();

        // Check if user already has an active shift
        const activeShift = await db.collection("shifts").findOne({
            userId: user.id,
            endTime: null,
        });

        if (activeShift) {
            return NextResponse.json({ error: "You already have an active shift" }, { status: 400 });
        }

        // Check if user has the required role for this shift type
        const requiredRoleId = SHIFT_ROLES[type as keyof typeof SHIFT_ROLES];
        if (!user.roles.includes(requiredRoleId)) {
            return NextResponse.json({
                error: `Permission Denied: You do not have the required role for ${type} shift.`
            }, { status: 403 });
        }

        // Add "On Shift" role
        await addDiscordRole(user.id, SHIFT_ROLES.ON_SHIFT);

        // Create shift record
        const newShift = {
            userId: user.id,
            username: user.username,
            type,
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0, // In seconds
        };

        await db.collection("shifts").insertOne(newShift);

        return NextResponse.json({ success: true, shift: newShift });
    } catch (error) {
        console.error("Failed to start shift:", error);
        return NextResponse.json({ error: "Failed to start shift" }, { status: 500 });
    }
}
