import { NextResponse } from "next/server";
import { ERLC_API_BASE_URL } from "@/app/config/erlc";

const serverKey = process.env.ERLC_SERVER_KEY || "";

export async function GET() {
  if (!serverKey) {
    return NextResponse.json(
      { error: "ERLC API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${ERLC_API_BASE_URL}/server/joinlogs`, {
      headers: {
        "Server-Key": serverKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch join logs" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("ERLC API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to ERLC API" },
      { status: 500 }
    );
  }
}
