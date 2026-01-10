import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import { AdminLevel } from "@/app/config/roles";
import { ObjectId } from "mongodb";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("discord_user");
        if (!userCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const loggedInUser = JSON.parse(userCookie.value);

        // Check for IA+ (AdminLevel 4+)
        if (loggedInUser.adminLevel < AdminLevel.INTERNAL_AFFAIRS) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        const id = (await params).id;
        if (!id) {
            return NextResponse.json({ error: "Missing log ID" }, { status: 400 });
        }

        const db = await getDatabase();
        const result = await db.collection("logs").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Log not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete log:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
