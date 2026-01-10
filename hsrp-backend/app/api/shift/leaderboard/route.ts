import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export async function GET() {
    try {
        const db = await getDatabase();

        const leaderboard = await db.collection("shifts").aggregate([
            {
                $match: { duration: { $gt: 0 } }
            },
            {
                $group: {
                    _id: "$userId",
                    username: { $first: "$username" },
                    totalDuration: { $sum: "$duration" },
                    shiftCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalDuration: -1 }
            },
            {
                $limit: 10
            }
        ]).toArray();

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
