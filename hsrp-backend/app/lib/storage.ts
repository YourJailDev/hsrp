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
