"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { AdminLevel } from "../config/roles";

interface User {
  id: string;
  username: string;
  avatar: string | null;
  adminLevel?: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export default function Announcements() {
  const [user, setUser] = useState<User | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((c) => c.trim().startsWith("discord_user="));

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
        setUser(userData);

        const isOwner = userData.adminLevel === AdminLevel.OWNER;
        const isDirectionBoard = (userData.adminLevel ?? 0) >= AdminLevel.DIRECTION_BOARD;
        setHasPermission(isOwner || isDirectionBoard);
      } catch {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }

    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim() || !hasPermission) return;

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      });

      if (res.ok) {
        fetchAnnouncements();
        setNewAnnouncement({ title: "", content: "", priority: "medium" });
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Failed to create announcement:", error);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!hasPermission) return;
    try {
      const res = await fetch(`/api/announcements?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAnnouncements(announcements.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show access denied if user doesn't have permission
  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex">
        <Sidebar user={user} />
        <main className="flex-1 lg:ml-72 relative overflow-hidden p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 flex items-center justify-center">
          {/* Background Image with Gradient Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: "url('/images/honolulu_sunset_background.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f] pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400 mb-6">Only Direction Board members can manage announcements.</p>
            <a href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-block">
              Return to Dashboard
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <Sidebar user={user} />

      <main className="flex-1 lg:ml-72 relative overflow-hidden p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: "url('/images/honolulu_sunset_background.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Announcements 📢</h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage and create announcements for HSRP staff</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all text-sm font-medium w-fit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Announcement
            </button>
          </div>

          {/* Announcements List */}
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl p-12 border border-white/5 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">No Announcements</h3>
                <p className="text-gray-400">Create your first announcement to get started</p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl p-6 border border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold text-lg">{announcement.title}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs border ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                      </span>
                    </div>
                    <button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="text-gray-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-300 mb-4 whitespace-pre-wrap">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {announcement.author}</span>
                    <span>•</span>
                    <span>{new Date(announcement.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-lg border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-xl">Create Announcement</h2>
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
                  <label className="block text-gray-400 text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    placeholder="Announcement title..."
                    className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Content</label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    placeholder="Write your announcement..."
                    rows={5}
                    className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Priority</label>
                  <div className="flex gap-3">
                    {(["low", "medium", "high"] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setNewAnnouncement({ ...newAnnouncement, priority })}
                        className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${newAnnouncement.priority === priority
                          ? getPriorityColor(priority)
                          : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                          }`}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl text-gray-400 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAnnouncement}
                    disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
                    className="flex-1 px-4 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Announcement
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
