"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

const STORAGE_KEY = "hsrp_announcements";

function getAnnouncements(): Announcement[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function DashboardAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAnnouncements(getAnnouncements().slice(0, 3)); // Get latest 3
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🚨";
      case "medium":
        return "⚠️";
      default:
        return "📢";
    }
  };

  if (!mounted) {
    return (
      <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Recent Announcements 🌺</h2>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-[#2a2a3e]/50 rounded-xl"></div>
          <div className="h-16 bg-[#2a2a3e]/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Recent Announcements 🌺</h2>
        <Link 
          href="/announcements" 
          className="text-sm text-gray-400 hover:text-white px-3 py-1 rounded-lg bg-[#2a2a3e] transition-colors"
        >
          View All
        </Link>
      </div>
      
      {announcements.length === 0 ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#2a2a3e]/50 border border-white/5">
          <span className="text-2xl">📭</span>
          <div>
            <p className="text-white text-sm">No announcements yet</p>
            <p className="text-gray-500 text-xs">Direction Board can create announcements</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`flex items-start gap-3 p-3 rounded-xl border ${getPriorityColor(announcement.priority)}`}
            >
              <span className="text-xl mt-0.5">{getPriorityIcon(announcement.priority)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium text-sm truncate">{announcement.title}</p>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-gray-400 text-xs line-clamp-2">{announcement.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500 text-xs">by {announcement.author}</span>
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {announcements.length > 0 && (
            <Link 
              href="/announcements" 
              className="block text-center text-sm text-blue-400 hover:text-blue-300 py-2 rounded-lg hover:bg-blue-500/10 transition-colors"
            >
              View all announcements →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
