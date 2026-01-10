"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { SHIFT_ROLES } from "../config/roles";

interface User {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    adminLevel: number;
    roles: string[];
}

interface ActiveShift {
    _id: string;
    type: string;
    startTime: string;
}

interface LeaderboardEntry {
    _id: string;
    username: string;
    totalDuration: number;
    shiftCount: number;
}

export default function ShiftPage() {
    const [user, setUser] = useState<User | null>(null);
    const [activeShift, setActiveShift] = useState<ActiveShift | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Fetch user from cookies
        const userCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("discord_user="))
            ?.split("=")[1];

        if (userCookie) {
            setUser(JSON.parse(decodeURIComponent(userCookie)));
        } else {
            window.location.href = "/";
        }

        fetchInitialData();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (activeShift) {
            const start = new Date(activeShift.startTime).getTime();
            const updateTimer = () => {
                const now = new Date().getTime();
                setTimer(Math.floor((now - start) / 1000));
            };
            updateTimer();
            timerRef.current = setInterval(updateTimer, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimer(0);
        }
    }, [activeShift]);

    const fetchInitialData = async () => {
        try {
            const [shiftRes, leaderboardRes] = await Promise.all([
                fetch("/api/shift/current"),
                fetch("/api/shift/leaderboard"),
            ]);

            const shiftData = await shiftRes.json();
            const leaderboardData = await leaderboardRes.json();

            setActiveShift(shiftData.activeShift);
            setLeaderboard(leaderboardData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const startShift = async (type: string) => {
        setActionLoading(true);
        try {
            const response = await fetch("/api/shift/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });

            const data = await response.json();
            if (data.success) {
                setActiveShift(data.shift);
            } else {
                alert(data.error || "Failed to start shift");
            }
        } catch (error) {
            console.error("Error starting shift:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const endShift = async () => {
        setActionLoading(true);
        try {
            const response = await fetch("/api/shift/end", {
                method: "POST",
            });

            const data = await response.json();
            if (data.success) {
                setActiveShift(null);
                fetchInitialData(); // Refresh leaderboard
            } else {
                alert(data.error || "Failed to end shift");
            }
        } catch (error) {
            console.error("Error ending shift:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    if (loading || !user) {
        return (
            <div className="flex min-h-screen bg-[#0a0a0f] items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0a0a0f]">
            <Sidebar user={user} />
            <main className="flex-1 lg:ml-72 relative overflow-hidden pt-16 lg:pt-0">
                <title>Shift Management | HSRP</title>
                <meta name="description" content="Manage your HSRP staff shifts, track time, and view the leaderboard." />

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
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Shift Management</h1>
                        <p className="text-gray-300">Track your duty time and climb the leaderboard</p>
                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Shift Controls */}
                        <div className="xl:col-span-2 space-y-6">
                            {activeShift ? (
                                <div className="bg-[#1a1a2e]/80 backdrop-blur-md rounded-2xl p-8 border border-blue-500/20 shadow-2xl">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-4 animate-pulse">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            ON DUTY: {activeShift.type.replace("_", " ")}
                                        </div>
                                        <div className="text-7xl font-mono font-bold text-white mb-6 tabular-nums tracking-wider">
                                            {formatTime(timer)}
                                        </div>
                                        <button
                                            onClick={endShift}
                                            disabled={actionLoading}
                                            className="w-full sm:w-auto px-12 py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
                                        >
                                            {actionLoading ? "Ending..." : "End Shift"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { id: "MODERATING", label: "Moderating", icon: "👮", color: "blue", role: SHIFT_ROLES.MODERATING },
                                        { id: "HR_SUPERVISOR", label: "HR Supervisor", icon: "📊", color: "purple", role: SHIFT_ROLES.HR_SUPERVISOR },
                                        { id: "FIFTY_FIFTY", label: "50/50", icon: "⚖️", color: "orange", role: SHIFT_ROLES.FIFTY_FIFTY },
                                    ].map((option) => {
                                        const hasRole = user.roles.includes(option.role);
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => startShift(option.id)}
                                                disabled={actionLoading || !hasRole}
                                                className={`group p-6 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur-sm border transition-all transform hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center gap-4 ${hasRole
                                                        ? `border-${option.color}-500/20 hover:border-${option.color}-500/50`
                                                        : 'border-white/5 opacity-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <span className="text-4xl">{option.icon}</span>
                                                <div className="text-center">
                                                    <h3 className="text-white font-bold text-lg">{option.label}</h3>
                                                    {!hasRole && <p className="text-red-400 text-xs mt-1">Locked</p>}
                                                </div>
                                                {hasRole && (
                                                    <div className={`mt-2 px-4 py-2 rounded-lg bg-${option.color}-500/10 text-${option.color}-400 text-sm font-medium group-hover:bg-${option.color}-500 group-hover:text-white transition-colors`}>
                                                        Start Shift
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Active Staff Summary (Optional/Placeholder) */}
                            <div className="bg-[#1a1a2e]/60 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                    Your Statistics
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <p className="text-gray-400 text-xs mb-1">Total Time</p>
                                        <p className="text-white font-bold">{formatDuration(leaderboard.find(e => e._id === user.id)?.totalDuration || 0)}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <p className="text-gray-400 text-xs mb-1">Total Shifts</p>
                                        <p className="text-white font-bold">{leaderboard.find(e => e._id === user.id)?.shiftCount || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-[#1a1a2e]/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl">
                                <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
                                    <span className="text-2xl">🏆</span>
                                    Leaderboard
                                </h2>
                                <div className="space-y-4">
                                    {leaderboard.length > 0 ? (
                                        leaderboard.map((entry, index) => (
                                            <div
                                                key={entry._id}
                                                className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${entry._id === user.id ? "bg-blue-500/20 border border-blue-500/30" : "hover:bg-white/5"
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? "bg-yellow-500 text-black" :
                                                        index === 1 ? "bg-gray-300 text-black" :
                                                            index === 2 ? "bg-amber-600 text-white" : "bg-white/10 text-gray-400"
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium truncate">{entry.username}</p>
                                                    <p className="text-gray-400 text-xs">{entry.shiftCount} shifts</p>
                                                </div>
                                                <div className="text-blue-400 font-mono font-bold text-sm">
                                                    {formatDuration(entry.totalDuration)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No data yet</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                                <h3 className="text-white font-medium mb-2">Did You Know?</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Keeping your shifts active helps our management team track activity and reward consistent staff contribution.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
