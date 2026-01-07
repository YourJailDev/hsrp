// API-based storage for training claims (shared across all users)

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

// Fetch all training claims from API
export async function getTrainingClaims(): Promise<TrainingClaim[]> {
  try {
    const response = await fetch("/api/training/claims");
    if (!response.ok) throw new Error("Failed to fetch claims");
    return await response.json();
  } catch (error) {
    console.error("Error fetching claims:", error);
    return [];
  }
}

// Add a new training claim
export async function addTrainingClaim(claim: TrainingClaim): Promise<TrainingClaim[]> {
  try {
    const response = await fetch("/api/training/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(claim),
    });
    if (!response.ok) throw new Error("Failed to add claim");
    return await response.json();
  } catch (error) {
    console.error("Error adding claim:", error);
    return [];
  }
}

// Update claim status
export async function updateTrainingClaimStatus(
  id: string,
  status: "approved" | "denied"
): Promise<TrainingClaim[]> {
  try {
    const response = await fetch("/api/training/claims", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) throw new Error("Failed to update claim");
    return await response.json();
  } catch (error) {
    console.error("Error updating claim:", error);
    return [];
  }
}

// Delete a claim
export async function deleteTrainingClaim(id: string): Promise<TrainingClaim[]> {
  try {
    const response = await fetch("/api/training/claims", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error("Failed to delete claim");
    return await response.json();
  } catch (error) {
    console.error("Error deleting claim:", error);
    return [];
  }
}

// Get recent claims (fetches all and returns first N)
export async function getRecentTrainingClaims(limit: number = 5): Promise<TrainingClaim[]> {
  const claims = await getTrainingClaims();
  return claims.slice(0, limit);
}

// Get stats
export async function getTrainingClaimsStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  denied: number;
}> {
  const claims = await getTrainingClaims();
  return {
    total: claims.length,
    pending: claims.filter((c) => c.status === "pending").length,
    approved: claims.filter((c) => c.status === "approved").length,
    denied: claims.filter((c) => c.status === "denied").length,
  };
}

// Training Sessions Storage
export interface TrainingSession {
  id: string;
  traineeId: string;
  traineeName: string;
  trainerId: string | null;
  trainerName: string | null;
  status: "waiting" | "active" | "completed" | "failed" | "cancelled";
  messages: ChatMessage[];
  createdAt: string;
  claimId?: string; // Link to training claim if created from one
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderType: "trainee" | "trainer" | "system";
  message: string;
  timestamp: string;
}

// Fetch all training sessions from API
export async function getTrainingSessions(): Promise<TrainingSession[]> {
  try {
    const response = await fetch("/api/training/sessions");
    if (!response.ok) throw new Error("Failed to fetch sessions");
    return await response.json();
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

// Save/update a training session
export async function saveTrainingSessions(sessions: TrainingSession[]): Promise<void> {
  // This is now handled by individual API calls
  // Kept for backward compatibility but sessions should be updated individually
  console.warn("saveTrainingSessions is deprecated, use updateTrainingSession instead");
}

// Update a single session
export async function updateTrainingSession(session: TrainingSession): Promise<TrainingSession | null> {
  try {
    const response = await fetch("/api/training/sessions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error("Failed to update session");
    return await response.json();
  } catch (error) {
    console.error("Error updating session:", error);
    return null;
  }
}

// Create a training session from a claim
export async function createSessionFromClaim(
  claim: TrainingClaim,
  trainerId: string,
  trainerName: string
): Promise<TrainingSession> {
  const session: TrainingSession = {
    id: Date.now().toString(),
    traineeId: claim.id,
    traineeName: claim.trainee,
    trainerId: trainerId,
    trainerName: trainerName,
    status: "active",
    messages: [
      {
        id: Date.now().toString(),
        sender: "System",
        senderType: "system",
        message: `Training session started! ${trainerName} will be training ${claim.trainee} on ${claim.trainingType}.`,
        timestamp: new Date().toISOString(),
      }
    ],
    createdAt: new Date().toISOString(),
    claimId: claim.id,
  };

  try {
    const response = await fetch("/api/training/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error("Failed to create session");
    return await response.json();
  } catch (error) {
    console.error("Error creating session:", error);
    return session;
  }
}

// Get session by claim ID
export async function getSessionByClaimId(claimId: string): Promise<TrainingSession | null> {
  try {
    const response = await fetch(`/api/training/sessions?claimId=${claimId}`);
    if (!response.ok) throw new Error("Failed to fetch session");
    return await response.json();
  } catch (error) {
    console.error("Error fetching session by claim ID:", error);
    return null;
  }
}

// Create a new training session (for request training flow)
export async function createTrainingSession(session: TrainingSession): Promise<TrainingSession> {
  try {
    const response = await fetch("/api/training/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error("Failed to create session");
    return await response.json();
  } catch (error) {
    console.error("Error creating session:", error);
    return session;
  }
}
