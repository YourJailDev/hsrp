"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

interface User {
  id: string;
  username: string;
  avatar: string | null;
  adminLevel?: number;
}

interface LOARequest {
  id: string;
  username: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "denied";
  submittedAt: string;
}

const STORAGE_KEY = "hsrp_loa_requests";
const WEBHOOK_URL = "https://discord.com/api/webhooks/1458419871477010433/_lkKVGzvEDTMgBjborMJCBsd5eYLrovNUffvusP1FCvBQOUqrIlwTgSmHdKZ4OE0Oioj";

function getLOARequests(): LOARequest[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLOARequests(requests: LOARequest[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export default function LOA() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<LOARequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
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

    setRequests(getLOARequests());
  }, []);

  const sendWebhook = async (loaData: LOARequest) => {
    const embed = {
      title: "📋 New LOA Request",
      color: 0xFFA500, // Orange color
      fields: [
        {
          name: "👤 Staff Member",
          value: loaData.username,
          inline: true,
        },
        {
          name: "🆔 Discord ID",
          value: loaData.userId,
          inline: true,
        },
        {
          name: "📅 Start Date",
          value: new Date(loaData.startDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          inline: false,
        },
        {
          name: "📅 End Date",
          value: new Date(loaData.endDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          inline: false,
        },
        {
          name: "⏱️ Duration",
          value: `${Math.ceil((new Date(loaData.endDate).getTime() - new Date(loaData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} day(s)`,
          inline: true,
        },
        {
          name: "📝 Reason",
          value: loaData.reason || "No reason provided",
          inline: false,
        },
      ],
      footer: {
        text: "HSRP Connect • LOA System",
      },
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [embed],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Failed to send webhook:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!user || !formData.startDate || !formData.endDate || !formData.reason.trim()) return;

    setIsSubmitting(true);

    const newRequest: LOARequest = {
      id: Date.now().toString(),
      username: user.username,
      userId: user.id,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason.trim(),
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    // Send webhook to Discord
    const webhookSent = await sendWebhook(newRequest);

    if (webhookSent) {
      const updated = [newRequest, ...requests];
      saveLOARequests(updated);
      setRequests(updated);
      setFormData({ startDate: "", endDate: "", reason: "" });
      setShowForm(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }

    setIsSubmitting(false);
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

  const myRequests = requests.filter((r) => r.userId === user?.id);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
      <Sidebar user={user} />

      <main className="flex-1 lg:ml-72 relative overflow-hidden pt-16 lg:pt-0">
        {/* Background with gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.discordapp.com/attachments/1458014676435599384/1458018803257708715/ChatGPT_Image_Jan_5_2026_10_45_46_PM.png?ex=6960c053&is=695f6ed3&hm=0023748885edd4a47d79c97c7e8db05bbc8501c85e5f661df687cd21086504b1')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Leave of Absence 🏖️</h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Submit and track your LOA requests</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all text-sm font-medium w-fit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request LOA
            </button>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-400">LOA request submitted successfully! It has been sent to Discord for review.</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-5 border border-white/5 shadow-xl">
              <p className="text-gray-400 text-sm mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-white">{myRequests.length}</p>
            </div>
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-5 border border-white/5 shadow-xl">
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{myRequests.filter((r) => r.status === "pending").length}</p>
            </div>
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-5 border border-white/5 shadow-xl">
              <p className="text-gray-400 text-sm mb-1">Approved</p>
              <p className="text-2xl font-bold text-green-400">{myRequests.filter((r) => r.status === "approved").length}</p>
            </div>
          </div>

          {/* My LOA Requests */}
          <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 shadow-xl">
            <div className="p-4 border-b border-white/5">
              <h2 className="text-white font-semibold">Your LOA History</h2>
            </div>
            {myRequests.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">No LOA Requests</h3>
                <p className="text-gray-400">You haven&apos;t submitted any leave of absence requests yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {myRequests.map((request) => (
                  <div key={request.id} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            Submitted {new Date(request.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2 text-white">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </div>
                          <span className="text-gray-500 text-sm">
                            ({Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days)
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{request.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOA Request Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-[#1a1a2e]/95 backdrop-blur-md rounded-2xl p-6 w-full max-w-lg border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Request Leave of Absence</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Start Date *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">End Date *</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        min={formData.startDate || new Date().toISOString().split("T")[0]}
                        className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {formData.startDate && formData.endDate && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                      <p className="text-blue-400 text-sm">
                        Duration: {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} day(s)
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Reason *</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      rows={4}
                      placeholder="Please provide a reason for your leave of absence..."
                      className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                    />
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-yellow-400 font-medium text-sm">Important</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Your LOA request will be sent to Discord for management review. Make sure all information is accurate before submitting.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!formData.startDate || !formData.endDate || !formData.reason.trim() || isSubmitting}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
