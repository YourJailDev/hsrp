import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Force Node.js runtime (not Edge) to allow fs operations
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Server-side storage for training claims
const DATA_DIR = path.join(process.cwd(), "data");
const CLAIMS_FILE = path.join(DATA_DIR, "training-claims.json");

export interface TrainingClaim {
  id: string;
  trainingType: string;
  trainee: string;
  trainer: string;
  date: string;
  status: "pending" | "approved" | "denied";
  notes: string;
  claimedAt: string;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read claims from file
function getClaims(): TrainingClaim[] {
  ensureDataDir();
  try {
    if (fs.existsSync(CLAIMS_FILE)) {
      const data = fs.readFileSync(CLAIMS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading claims:", error);
  }
  return [];
}

// Save claims to file
function saveClaims(claims: TrainingClaim[]) {
  ensureDataDir();
  fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2));
}

// GET - Fetch all claims
export async function GET() {
  try {
    const claims = getClaims();
    return NextResponse.json(claims);
  } catch (error) {
    console.error("Error fetching claims:", error);
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
  }
}

// POST - Create new claim
export async function POST(request: Request) {
  try {
    const claim: TrainingClaim = await request.json();
    const claims = getClaims();
    const updated = [claim, ...claims];
    saveClaims(updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error creating claim:", error);
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 });
  }
}

// PUT - Update claim status
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    const claims = getClaims();
    const updated = claims.map((c) => (c.id === id ? { ...c, status } : c));
    saveClaims(updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating claim:", error);
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 });
  }
}

// DELETE - Delete claim
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const claims = getClaims();
    const updated = claims.filter((c) => c.id !== id);
    saveClaims(updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error deleting claim:", error);
    return NextResponse.json({ error: "Failed to delete claim" }, { status: 500 });
  }
}
