import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Force Node.js runtime (not Edge) to allow fs operations
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Server-side storage for training sessions
const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "training-sessions.json");

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

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read sessions from file
function getSessions(): TrainingSession[] {
  ensureDataDir();
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = fs.readFileSync(SESSIONS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading sessions:", error);
  }
  return [];
}

// Save sessions to file
function saveSessions(sessions: TrainingSession[]) {
  ensureDataDir();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

// GET - Fetch all sessions or specific session
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const claimId = searchParams.get("claimId");
    const sessionId = searchParams.get("sessionId");
    
    const sessions = getSessions();
    
    if (claimId) {
      const session = sessions.find(s => s.claimId === claimId);
      return NextResponse.json(session || null);
    }
    
    if (sessionId) {
      const session = sessions.find(s => s.id === sessionId);
      return NextResponse.json(session || null);
    }
    
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
    const sessions = getSessions();
    const updated = [session, ...sessions];
    saveSessions(updated);
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
    const sessions = getSessions();
    const updated = sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    saveSessions(updated);
    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

// DELETE - Delete session
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const sessions = getSessions();
    const updated = sessions.filter((s) => s.id !== id);
    saveSessions(updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
