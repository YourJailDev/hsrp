import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import { AdminLevel } from "@/app/config/roles";

export async function GET() {
    try {
        const db = await getDatabase();
        const reminders = await db.collection("reminders")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(reminders);
    } catch (error) {
        console.error("Failed to fetch reminders:", error);
        return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("discord_user");
        if (!userCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = JSON.parse(userCookie.value);

        // Check if user is Management+ or Owner
        if (user.adminLevel < AdminLevel.MANAGEMENT && user.adminLevel !== AdminLevel.OWNER) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        const { id, message, interval, active } = await req.json();

        if (!message || interval === undefined) {
            return NextResponse.json({ error: "Message and interval are required" }, { status: 400 });
        }

        const db = await getDatabase();

        if (id) {
            // Update existing
            const result = await db.collection("reminders").updateOne(
                { id },
                {
                    $set: {
                        message,
                        interval: parseInt(interval),
                        active: active ?? true,
                        updatedAt: new Date().toISOString()
                    }
                }
            );

            if (result.matchedCount === 0) {
                return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true });
        } else {
            // Create new
            const reminder = {
                id: Date.now().toString(),
                message,
                interval: parseInt(interval),
                active: true,
                lastSent: 0, // Never sent
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: user.username,
            };

            await db.collection("reminders").insertOne(reminder);
            return NextResponse.json({ success: true, reminder });
        }
    } catch (error) {
        console.error("Failed to save reminder:", error);
        return NextResponse.json({ error: "Failed to save reminder" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const userCookie = cookieStore.get("discord_user");
        if (!userCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const user = JSON.parse(userCookie.value);

        // Check if user is Management+ or Owner
        if (user.adminLevel < AdminLevel.MANAGEMENT && user.adminLevel !== AdminLevel.OWNER) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        const db = await getDatabase();
        const result = await db.collection("reminders").deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete reminder:", error);
        return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 });
    }
}
