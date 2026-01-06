// Simple localStorage-based storage for training claims

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

const STORAGE_KEY = "hsrp_training_claims";

export function getTrainingClaims(): TrainingClaim[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveTrainingClaims(claims: TrainingClaim[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
  } catch (error) {
    console.error("Failed to save training claims:", error);
  }
}

export function addTrainingClaim(claim: TrainingClaim): TrainingClaim[] {
  const claims = getTrainingClaims();
  const updated = [claim, ...claims];
  saveTrainingClaims(updated);
  return updated;
}

export function updateTrainingClaimStatus(id: string, status: "approved" | "denied"): TrainingClaim[] {
  const claims = getTrainingClaims();
  const updated = claims.map((c) => (c.id === id ? { ...c, status } : c));
  saveTrainingClaims(updated);
  return updated;
}

export function deleteTrainingClaim(id: string): TrainingClaim[] {
  const claims = getTrainingClaims();
  const updated = claims.filter((c) => c.id !== id);
  saveTrainingClaims(updated);
  return updated;
}

// Get recent claims (last 5)
export function getRecentTrainingClaims(limit: number = 5): TrainingClaim[] {
  const claims = getTrainingClaims();
  return claims.slice(0, limit);
}

// Get stats
export function getTrainingClaimsStats() {
  const claims = getTrainingClaims();
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

const SESSIONS_STORAGE_KEY = "hsrp_training_sessions";

export function getTrainingSessions(): TrainingSession[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveTrainingSessions(sessions: TrainingSession[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
}

// Create a training session from a claim
export function createSessionFromClaim(
  claim: TrainingClaim,
  trainerId: string,
  trainerName: string
): TrainingSession {
  const session: TrainingSession = {
    id: Date.now().toString(),
    traineeId: claim.id, // Using claim ID as reference since we don't have trainee's Discord ID
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

  const sessions = getTrainingSessions();
  const updated = [session, ...sessions];
  saveTrainingSessions(updated);

  return session;
}

// Get session by claim ID
export function getSessionByClaimId(claimId: string): TrainingSession | null {
  const sessions = getTrainingSessions();
  return sessions.find(s => s.claimId === claimId) || null;
}
