import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import { AdminLevel } from "@/app/config/roles";

export async function GET() {
    try {
        const db = await getDatabase();
        const announcements = await db.collection("announcements")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(announcements);
    } catch (error) {
        console.error("Failed to fetch announcements:", error);
        return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
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

        // Check if user is Direction Board+ or Owner
        if (user.adminLevel < AdminLevel.DIRECTION_BOARD && user.adminLevel !== AdminLevel.OWNER) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        const { title, content, priority } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        const db = await getDatabase();
        const announcement = {
            id: Date.now().toString(),
            title,
            content,
            author: user.username,
            createdAt: new Date().toISOString(),
            priority: priority || "medium",
        };

        await db.collection("announcements").insertOne(announcement);

        return NextResponse.json({ success: true, announcement });
    } catch (error) {
        console.error("Failed to create announcement:", error);
        return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
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

        // Check if user is Direction Board+ or Owner
        if (user.adminLevel < AdminLevel.DIRECTION_BOARD && user.adminLevel !== AdminLevel.OWNER) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        const db = await getDatabase();
        const result = await db.collection("announcements").deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete announcement:", error);
        return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
    }
}
