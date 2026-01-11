import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { ERLC_API_BASE_URL } from "@/app/config/erlc";

const serverKey = process.env.ERLC_SERVER_KEY || "";

export async function POST(req: NextRequest) {
    if (!serverKey) {
        return NextResponse.json({ error: "ERLC API key not configured" }, { status: 500 });
    }

    try {
        // Optional: Add a simple secret check for cron security
        // const authHeader = req.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const db = await getDatabase();
        const now = Date.now();

        // Find active reminders
        const reminders = await db.collection("reminders")
            .find({ active: true })
            .toArray();

        console.log(`[Reminders] Found ${reminders.length} active reminders`);

        let sentCount = 0;
        const results = [];

        for (const reminder of reminders) {
            const intervalMs = reminder.interval * 1000;
            const timeSinceLastSent = now - (reminder.lastSent || 0);

            console.log(`[Reminders] Checking "${reminder.message.substring(0, 20)}...": Due in ${Math.max(0, (intervalMs - timeSinceLastSent) / 1000).toFixed(1)}s`);

            if (timeSinceLastSent >= intervalMs) {
                // Time to send!
                // Use :h (hint) instead of :m (message) as requested
                // If message starts with : (e.g. :m or :h), use it as is
                const command = reminder.message.startsWith(":") ? reminder.message : `:h ${reminder.message}`;

                console.log(`[Reminders] Sending command: ${command}`);

                try {
                    const response = await fetch(`${ERLC_API_BASE_URL}/server/command`, {
                        method: "POST",
                        headers: {
                            "Server-Key": serverKey,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ command }),
                    });

                    if (response.ok) {
                        console.log(`[Reminders] Successfully sent: ${reminder.id}`);
                        await db.collection("reminders").updateOne(
                            { id: reminder.id },
                            { $set: { lastSent: now } }
                        );
                        sentCount++;
                        results.push({ id: reminder.id, status: "success" });
                    } else {
                        const errorText = await response.text();
                        console.error(`[Reminders] Failed to send ${reminder.id} (Status ${response.status}):`, errorText);
                        results.push({ id: reminder.id, status: "failed", error: errorText, statusCode: response.status });
                    }
                } catch (err) {
                    console.error(`[Reminders] Error during fetch for ${reminder.id}:`, err);
                    results.push({ id: reminder.id, status: "error", error: String(err) });
                }
            }
        }

        return NextResponse.json({
            success: true,
            sentCount,
            results
        });
    } catch (error) {
        console.error("Failed to process reminders:", error);
        return NextResponse.json({ error: "Failed to process reminders" }, { status: 500 });
    }
}
