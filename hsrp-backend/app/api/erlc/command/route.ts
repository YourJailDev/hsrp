import { NextRequest, NextResponse } from "next/server";
import { ERLC_API_BASE_URL } from "@/app/config/erlc";

const serverKey = process.env.ERLC_SERVER_KEY || "";

export async function POST(request: NextRequest) {
  if (!serverKey) {
    return NextResponse.json(
      { error: "ERLC API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { command } = body;

    if (!command) {
      return NextResponse.json(
        { error: "Command is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${ERLC_API_BASE_URL}/server/command`, {
      method: "POST",
      headers: {
        "Server-Key": serverKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });

    if (response.status === 422) {
      return NextResponse.json(
        { error: "No players in server" },
        { status: 422 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to execute command" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERLC API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to ERLC API" },
      { status: 500 }
    );
  }
}
