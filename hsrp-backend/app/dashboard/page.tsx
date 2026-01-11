"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
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

interface DevNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [devNotes, setDevNotes] = useState<DevNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDevNoteModal, setShowDevNoteModal] = useState(false);
  const [newDevNote, setNewDevNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [annRes, devRes] = await Promise.all([
        fetch("/api/announcements"),
        fetch("/api/dev-notes")
      ]);

      if (annRes.ok) setAnnouncements(await annRes.json());
      if (devRes.ok) setDevNotes(await devRes.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDevNote = async () => {
    if (!newDevNote.trim() || actionLoading) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/dev-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newDevNote }),
      });

      if (res.ok) {
        const data = await res.json();
        setDevNotes([data.devNote, ...devNotes]);
        setNewDevNote("");
        setShowDevNoteModal(false);
      }
    } catch (error) {
      console.error("Failed to create dev note:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteDevNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dev note?")) return;
    try {
      const res = await fetch(`/api/dev-notes?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDevNotes(devNotes.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete dev note:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f] items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isOwner = user.adminLevel === AdminLevel.OWNER;

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar user={user} />
      <main className="flex-1 lg:ml-72 relative overflow-hidden pt-16 lg:pt-0 pb-12">
        <title>Dashboard | HSRP</title>

        {/* Background with gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/honolulu_sunset_background.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />

        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Aloha, {user.username} 🌺</h1>
            <p className="text-gray-300">Mahalo for keeping HSRP running smoothly</p>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Server Status */}
            <div className="rounded-2xl p-6 bg-[#1a1a2e]/60 backdrop-blur-md border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🖥️</span>
                <span className="text-white/90 font-medium">Server Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <p className="text-2xl font-bold text-white">Online</p>
              </div>
            </div>

            {/* Announcements Quick Link */}
            <Link href="/announcements" className="rounded-2xl p-6 bg-gradient-to-br from-blue-600/40 to-blue-800/40 backdrop-blur-md border border-blue-500/20 hover:from-blue-600/50 hover:to-blue-800/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📢</span>
                  <span className="text-white font-medium">Announcements</span>
                </div>
                <span className="text-white/60 text-sm">View All →</span>
              </div>
              <p className="text-white font-bold text-xl truncate">
                {announcements[0]?.title || "No recent announcements"}
              </p>
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="xl:col-span-2 space-y-8">
              {/* Announcements Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold text-xl flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Latest Announcements
                  </h2>
                  <Link href="/announcements" className="text-blue-400 text-sm hover:underline font-medium">View All</Link>
                </div>
                <div className="space-y-4">
                  {announcements.length > 0 ? (
                    announcements.slice(0, 3).map((ann) => (
                      <div key={ann.id} className="bg-[#1a1a2e]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-bold">{ann.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ann.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                            {ann.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-3">{ann.content}</p>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                          <span>By {ann.author}</span>
                          <span>•</span>
                          <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#1a1a2e]/30 rounded-2xl p-8 border border-dashed border-white/5 text-center">
                      <p className="text-gray-500 text-sm">No announcements to display</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Dev Notes Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold text-xl flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                    Developer Updates
                  </h2>
                  {isOwner && (
                    <button
                      onClick={() => setShowDevNoteModal(true)}
                      className="px-4 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-bold rounded-lg border border-purple-500/20 transition-all"
                    >
                      + Add Note
                    </button>
                  )}
                </div>
                <div className="bg-[#1a1a2e]/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
                  {devNotes.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {devNotes.map((note) => (
                        <div key={note.id} className="p-6 hover:bg-white/[0.02] transition-colors group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-gray-300 text-sm leading-relaxed mb-3">{note.content}</p>
                              <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                <span className="text-purple-400"># DEV UPDATE</span>
                                <span>•</span>
                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {isOwner && (
                              <button
                                onClick={() => deleteDevNote(note.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-gray-500 text-sm">No developer updates available</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Quick Navigation */}
              <div className="bg-[#1a1a2e]/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
                <h2 className="text-white font-bold text-lg mb-6">Staff Shortcuts</h2>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { name: "Shift Portal", href: "/shift", icon: "👮", color: "blue" },
                    { name: "Logging System", href: "/logging", icon: "📊", color: "blue" },
                    { name: "Staff Handbook", href: "/staff-handbook", icon: "📖", color: "purple" },
                    { name: "LOA Request", href: "/loa", icon: "📅", color: "orange" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="text-white font-medium text-sm">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* HSRP Branding Card */}
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-white/5 text-8xl rotate-12 group-hover:rotate-0 transition-all duration-700 font-black">HSRP</div>
                <h3 className="text-white font-bold mb-2">Developed with Aloha 🌺</h3>
                <p className="text-gray-400 text-xs leading-relaxed relative z-10">
                  Honolulu State Roleplay Staff Portal is designed to provide the most seamless experience for our moderation team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dev Note Modal */}
        {showDevNoteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a2e] rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
              <h2 className="text-white font-bold text-xl mb-6">New Developer Note</h2>
              <textarea
                value={newDevNote}
                onChange={(e) => setNewDevNote(e.target.value)}
                placeholder="What's new in the system?"
                rows={4}
                className="w-full bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDevNoteModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl text-gray-400 bg-white/5 hover:bg-white/10 transition-colors font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDevNote}
                  disabled={!newDevNote.trim() || actionLoading}
                  className="flex-1 px-4 py-3 rounded-xl text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-sm"
                >
                  {actionLoading ? "Saving..." : "Publish Note"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
