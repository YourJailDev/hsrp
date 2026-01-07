import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

// GET - Fetch all claims
export async function GET() {
  try {
    const db = await getDatabase();
    const claims = await db.collection<TrainingClaim>("training_claims")
      .find({})
      .sort({ claimedAt: -1 })
      .toArray();
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
    const db = await getDatabase();
    await db.collection<TrainingClaim>("training_claims").insertOne(claim);
    const claims = await db.collection<TrainingClaim>("training_claims")
      .find({})
      .sort({ claimedAt: -1 })
      .toArray();
    return NextResponse.json(claims);
  } catch (error) {
    console.error("Error creating claim:", error);
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 });
  }
}

// PUT - Update claim status
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    const db = await getDatabase();
    await db.collection<TrainingClaim>("training_claims").updateOne(
      { id },
      { $set: { status } }
    );
    const claims = await db.collection<TrainingClaim>("training_claims")
      .find({})
      .sort({ claimedAt: -1 })
      .toArray();
    return NextResponse.json(claims);
  } catch (error) {
    console.error("Error updating claim:", error);
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 });
  }
}

// DELETE - Delete claim
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const db = await getDatabase();
    await db.collection<TrainingClaim>("training_claims").deleteOne({ id });
    const claims = await db.collection<TrainingClaim>("training_claims")
      .find({})
      .sort({ claimedAt: -1 })
      .toArray();
    return NextResponse.json(claims);
  } catch (error) {
    console.error("Error deleting claim:", error);
    return NextResponse.json({ error: "Failed to delete claim" }, { status: 500 });
  }
}
