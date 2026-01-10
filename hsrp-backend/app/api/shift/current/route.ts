import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("discord_user");
        if (!userCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = JSON.parse(userCookie.value);

        const db = await getDatabase();

        const activeShift = await db.collection("shifts").findOne({
            userId: user.id,
            endTime: null,
        });

        return NextResponse.json({ activeShift });
    } catch (error) {
        console.error("Failed to fetch current shift:", error);
        return NextResponse.json({ error: "Failed to fetch current shift" }, { status: 500 });
    }
}
