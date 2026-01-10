import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { ERLC_API_BASE_URL } from "@/app/config/erlc";

const serverKey = process.env.ERLC_SERVER_KEY || "";

export async function POST() {
    if (!serverKey) {
        return NextResponse.json({ error: "ERLC key not configured" }, { status: 500 });
    }

    try {
        const db = await getDatabase();

        // 1. Fetch current players
        const playersRes = await fetch(`${ERLC_API_BASE_URL}/server/players`, {
            headers: { "Server-Key": serverKey },
            cache: "no-store"
        });

        if (!playersRes.ok) {
            return NextResponse.json({ error: "Failed to fetch players" }, { status: playersRes.status });
        }

        const players = await playersRes.json();
        // ERLC players can be strings "Name:ID" or objects. Let's handle both.
        const currentNames = players.map((p: any) => {
            const playerStr = p.Player || (typeof p === 'string' ? p : null);
            if (!playerStr) return null;
            return playerStr.split(":")[0];
        }).filter((name: string | null) => name !== null);

        // 2. Query pending notifications for in-game players
        const pending = await db.collection("notifications").find({
            sent: false,
            targetUser: { $in: currentNames }
        }).toArray();

        if (pending.length === 0) {
            return NextResponse.json({ success: true, processed: 0 });
        }

        // 3. Process each notification
        for (const note of pending) {
            const command = `:pm ${note.targetUser} You have been ${note.type} for ${note.reason}`;

            try {
                const cmdRes = await fetch(`${ERLC_API_BASE_URL}/server/command`, {
                    method: "POST",
                    headers: {
                        "Server-Key": serverKey,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ command })
                });

                if (cmdRes.ok) {
                    await db.collection("notifications").updateOne(
                        { _id: note._id },
                        { $set: { sent: true, sentAt: new Date().toISOString() } }
                    );
                }
            } catch (err) {
                console.error(`Failed to send PM to ${note.targetUser}:`, err);
            }
        }

        return NextResponse.json({ success: true, processed: pending.length });
    } catch (error) {
        console.error("Notification check error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
