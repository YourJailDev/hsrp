import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface ChatMessage {
  id: string;
  sender: string;
  senderType: "trainee" | "trainer" | "system";
  message: string;
  timestamp: string;
}

export interface TrainingSession {
  id: string;
  traineeId: string;
  traineeName: string;
  trainerId: string | null;
  trainerName: string | null;
  status: "waiting" | "active" | "completed" | "failed" | "cancelled";
  messages: ChatMessage[];
  createdAt: string;
  claimId?: string;
}

// GET - Fetch all sessions or specific session
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const claimId = searchParams.get("claimId");
    const sessionId = searchParams.get("sessionId");
    
    const db = await getDatabase();
    
    if (claimId) {
      const session = await db.collection<TrainingSession>("training_sessions").findOne({ claimId });
      return NextResponse.json(session || null);
    }
    
    if (sessionId) {
      const session = await db.collection<TrainingSession>("training_sessions").findOne({ id: sessionId });
      return NextResponse.json(session || null);
    }
    
    const sessions = await db.collection<TrainingSession>("training_sessions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

// POST - Create new session
export async function POST(request: Request) {
  try {
    const session: TrainingSession = await request.json();
    const db = await getDatabase();
    await db.collection<TrainingSession>("training_sessions").insertOne(session);
    return NextResponse.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

// PUT - Update session (status, messages, etc.)
export async function PUT(request: Request) {
  try {
    const updatedSession: TrainingSession = await request.json();
    const db = await getDatabase();
    if (!updatedSession.id) {
      console.error("Session update failed: missing id", updatedSession);
      return NextResponse.json({ error: "Session update failed: missing id" }, { status: 400 });
    }
    const result = await db.collection<TrainingSession>("training_sessions").replaceOne(
      { id: updatedSession.id },
      updatedSession,
      { upsert: true }
    );
    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      console.error("Session update failed: no document modified or upserted", updatedSession, result);
      return NextResponse.json({ error: "Session update failed: no document modified or upserted" }, { status: 500 });
    }
    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating session:", error);
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json({ error: "Failed to update session", details: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete session
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await getDatabase();
    await db.collection<TrainingSession>("training_sessions").deleteOne({ id });
    const sessions = await db.collection<TrainingSession>("training_sessions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
