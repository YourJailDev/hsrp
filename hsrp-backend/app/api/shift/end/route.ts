import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import { SHIFT_ROLES } from "@/app/config/roles";
import { removeDiscordRole } from "@/app/lib/discord";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("discord_user");
        if (!userCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = JSON.parse(userCookie.value);

        const db = await getDatabase();

        // Find the active shift
        const activeShift = await db.collection("shifts").findOne({
            userId: user.id,
            endTime: null,
        });

        if (!activeShift) {
            return NextResponse.json({ error: "No active shift found" }, { status: 400 });
        }

        const endTime = new Date().toISOString();
        const startTime = new Date(activeShift.startTime);
        const endT = new Date(endTime);
        const durationSeconds = Math.floor((endT.getTime() - startTime.getTime()) / 1000);

        // Update shift record
        await db.collection("shifts").updateOne(
            { _id: new ObjectId(activeShift._id) },
            {
                $set: {
                    endTime,
                    duration: durationSeconds,
                },
            }
        );

        // Remove "On Shift" role
        await removeDiscordRole(user.id, SHIFT_ROLES.ON_SHIFT);

        return NextResponse.json({
            success: true,
            shift: {
                ...activeShift,
                endTime,
                duration: durationSeconds,
            },
        });
    } catch (error) {
        console.error("Failed to end shift:", error);
        return NextResponse.json({ error: "Failed to end shift" }, { status: 500 });
    }
}
