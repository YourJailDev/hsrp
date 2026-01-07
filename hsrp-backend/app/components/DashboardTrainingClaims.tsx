"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecentTrainingClaims, getTrainingClaimsStats, type TrainingClaim } from "../lib/storage";

export default function DashboardTrainingClaims() {
  const [recentClaims, setRecentClaims] = useState<TrainingClaim[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, denied: 0 });

  useEffect(() => {
    const loadData = async () => {
      const claims = await getRecentTrainingClaims(3);
      setRecentClaims(claims);
      const claimsStats = await getTrainingClaimsStats();
      setStats(claimsStats);
    };
    loadData();
  }, []);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "✓";
      case "denied":
        return "✕";
      case "pending":
        return "⏳";
      default:
        return "•";
    }
  };

  return (
    <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Recent Training Claims 📋</h2>
        <Link 
          href="/training-claims"
          className="text-sm text-gray-400 hover:text-white px-3 py-1 rounded-lg bg-[#2a2a3e] transition-colors"
        >
          View All
        </Link>
      </div>
      
      {/* Mini Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#2a2a3e]/50 rounded-lg p-2 text-center">
          <p className="text-yellow-400 text-lg font-bold">{stats.pending}</p>
          <p className="text-gray-500 text-xs">Pending</p>
        </div>
        <div className="bg-[#2a2a3e]/50 rounded-lg p-2 text-center">
          <p className="text-green-400 text-lg font-bold">{stats.approved}</p>
          <p className="text-gray-500 text-xs">Approved</p>
        </div>
        <div className="bg-[#2a2a3e]/50 rounded-lg p-2 text-center">
          <p className="text-red-400 text-lg font-bold">{stats.denied}</p>
          <p className="text-gray-500 text-xs">Denied</p>
        </div>
      </div>

      {/* Recent Claims List */}
      <div className="space-y-2">
        {recentClaims.length === 0 ? (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#2a2a3e]/50">
            <span className="text-xl">📋</span>
            <div>
              <p className="text-white text-sm">No training claims yet</p>
              <p className="text-gray-500 text-xs">Claims will appear here</p>
            </div>
          </div>
        ) : (
          recentClaims.map((claim) => (
            <div key={claim.id} className="flex items-center justify-between p-3 rounded-xl bg-[#2a2a3e]/50">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-sm ${getStatusColor(claim.status).split(' ')[1]}`}>
                  {getStatusIcon(claim.status)}
                </span>
                <div className="min-w-0">
                  <p className="text-white text-sm truncate">{claim.trainee}</p>
                  <p className="text-gray-500 text-xs truncate">{claim.trainingType}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs shrink-0 ${getStatusColor(claim.status)}`}>
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
