"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { 
  getTrainingClaims, 
  addTrainingClaim, 
  updateTrainingClaimStatus, 
  deleteTrainingClaim,
  createSessionFromClaim,
  getSessionByClaimId,
  type TrainingClaim 
} from "../lib/storage";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  avatar: string | null;
  adminLevel?: number;
}

const TRAINING_TYPES = [
  "Moderation Training",
];

export default function TrainingClaims() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<TrainingClaim[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "denied">("all");
  const [newClaim, setNewClaim] = useState({
    trainingType: TRAINING_TYPES[0],
    trainee: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((c) => c.trim().startsWith("discord_user="));

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
        setUser(userData);
      } catch {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }
    
    // Load claims from API
    const loadClaims = async () => {
      const claims = await getTrainingClaims();
      setClaims(claims);
    };
    loadClaims();
  }, []);

  const handleCreateClaim = async () => {
    if (!newClaim.trainee.trim() || !newClaim.date) return;

    const claim: TrainingClaim = {
      id: Date.now().toString(),
      trainingType: newClaim.trainingType,
      trainee: newClaim.trainee,
      trainer: user?.username || "Unknown",
      date: newClaim.date,
      status: "pending",
      notes: newClaim.notes,
      claimedAt: new Date().toISOString(),
    };

    const updated = await addTrainingClaim(claim);
    setClaims(updated);
    setNewClaim({ trainingType: TRAINING_TYPES[0], trainee: "", date: "", notes: "" });
    setShowCreateModal(false);
  };

  const handleUpdateStatus = async (id: string, status: "approved" | "denied") => {
    const updated = await updateTrainingClaimStatus(id, status);
    setClaims(updated);
  };

  const handleDelete = async (id: string) => {
    const updated = await deleteTrainingClaim(id);
    setClaims(updated);
  };

  const handleStartTraining = async (claim: TrainingClaim) => {
    if (!user) return;
    
    // Check if a session already exists for this claim
    const existingSession = await getSessionByClaimId(claim.id);
    if (existingSession) {
      // If session exists, redirect to it
      router.push(`/staff-training?sessionId=${existingSession.id}`);
      return;
    }
    
    // Create a new training session from the claim
    const session = await createSessionFromClaim(claim, user.id, user.username);
    
    // Mark the claim as approved since training is starting
    await updateTrainingClaimStatus(claim.id, "approved");
    const updatedClaims = await getTrainingClaims();
    setClaims(updatedClaims);
    
    // Redirect to staff training with the session ID
    router.push(`/staff-training?sessionId=${session.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "denied":
        return "bg-red-500/20 text-red-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredClaims = filterStatus === "all" ? claims : claims.filter((c) => c.status === filterStatus);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <Sidebar user={user} />

      <main className="flex-1 lg:ml-72 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Training Claims 📋</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">Log and manage staff training sessions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all text-sm font-medium w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Log Training
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl p-5 border border-white/5">
            <p className="text-gray-400 text-sm mb-1">Total Claims</p>
            <p className="text-2xl font-bold text-white">{claims.length}</p>
          </div>
          <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl p-5 border border-white/5">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{claims.filter((c) => c.status === "pending").length}</p>
          </div>
          <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl p-5 border border-white/5">
            <p className="text-gray-400 text-sm mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-400">{claims.filter((c) => c.status === "approved").length}</p>
          </div>
          <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl p-5 border border-white/5">
            <p className="text-gray-400 text-sm mb-1">Denied</p>
            <p className="text-2xl font-bold text-red-400">{claims.filter((c) => c.status === "denied").length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-[#1a1a2e]/50 p-1 rounded-xl w-fit">
          {(["all", "pending", "approved", "denied"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2a3e]"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Claims Table */}
        <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0a0f]/50">
                <tr>
                  <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Training Type</th>
                  <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Trainee</th>
                  <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Trainer</th>
                  <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Date</th>
                  <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Status</th>
                  <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-12">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      No training claims found
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => (
                    <tr key={claim.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{claim.trainingType}</td>
                      <td className="px-4 py-3 text-gray-300">{claim.trainee}</td>
                      <td className="px-4 py-3 text-gray-400">{claim.trainer}</td>
                      <td className="px-4 py-3 text-gray-400">{new Date(claim.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {claim.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleStartTraining(claim)}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-1"
                                title="Start Training"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(claim.id, "denied")}
                                className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                title="Deny"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          )}
                          {claim.status === "approved" && (
                            <button
                              onClick={() => handleStartTraining(claim)}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
                              title="Continue Training"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Chat
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(claim.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-lg border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-xl">Log Training Session</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Training Type</label>
                  <select
                    value={newClaim.trainingType}
                    onChange={(e) => setNewClaim({ ...newClaim, trainingType: e.target.value })}
                    className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    {TRAINING_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Trainee Username</label>
                  <input
                    type="text"
                    value={newClaim.trainee}
                    onChange={(e) => setNewClaim({ ...newClaim, trainee: e.target.value })}
                    placeholder="Enter trainee's username..."
                    className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Training Date</label>
                  <input
                    type="date"
                    value={newClaim.date}
                    onChange={(e) => setNewClaim({ ...newClaim, date: e.target.value })}
                    className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Notes (Optional)</label>
                  <textarea
                    value={newClaim.notes}
                    onChange={(e) => setNewClaim({ ...newClaim, notes: e.target.value })}
                    placeholder="Additional notes about the training..."
                    rows={3}
                    className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl text-gray-400 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateClaim}
                    disabled={!newClaim.trainee.trim() || !newClaim.date}
                    className="flex-1 px-4 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Log Training
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
