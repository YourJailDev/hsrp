"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Sidebar from "../components/Sidebar";

interface User {
    id: string;
    username: string;
    avatar: string | null;
    adminLevel?: number;
}

interface LogEntry {
    _id?: string;
    user: {
        name: string;
        avatar: string | null;
    };
    action: string;
    notes: string;
    timestamp: string;
    type: string;
}

interface IngamePlayer {
    id: string;
    username: string;
}

export default function LoggingPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [logsLoading, setLogsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMember, setFilterMember] = useState("Any Member");
    const [filterAction, setFilterAction] = useState("All Actions");

    const [ingamePlayers, setIngamePlayers] = useState<IngamePlayer[]>([]);
    const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Form state for new log
    const [newLog, setNewLog] = useState({
        targetUser: "",
        type: "Warn",
        reason: "",
        description: "",
    });

    const fetchLogs = async () => {
        setLogsLoading(true);
        try {
            const res = await fetch("/api/logs");
            if (res.ok) {
                const data = await res.json();
                setLogs(data || []);
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setLogsLoading(false);
        }
    };

    const fetchIngamePlayers = async () => {
        try {
            const res = await fetch("/api/erlc/players");
            if (res.ok) {
                const data = await res.json();
                // Map the ERLC data to our IngamePlayer interface
                // Based on ERLC API it's usually an array of strings or objects
                if (Array.isArray(data)) {
                    const formatted: IngamePlayer[] = data
                        .map((p: any) => {
                            const playerStr = p.Player || (typeof p === 'string' ? p : null);
                            if (!playerStr) return null;

                            const parts = playerStr.split(":");
                            const username = parts[0] || playerStr;
                            const id = parts[1] || playerStr;

                            return {
                                id: id,
                                username: username
                            };
                        })
                        .filter((p): p is IngamePlayer => p !== null);
                    setIngamePlayers(formatted);
                }
            }
        } catch (err) {
            console.error("Failed to fetch ingame players:", err);
        }
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    fetchLogs();

                    // Periodic notification check for staff members (every 45s)
                    const interval = setInterval(() => {
                        fetch("/api/notifications/check", { method: "POST" })
                            .catch(err => console.error("Notification check error:", err));
                    }, 45000);

                    return () => clearInterval(interval);
                } else {
                    window.location.href = "/";
                }
            } catch (err) {
                window.location.href = "/";
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (showCreateModal) {
            fetchIngamePlayers();
        }
    }, [showCreateModal]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowPlayerDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreateLog = async () => {
        if (!newLog.targetUser || !newLog.reason) return;

        try {
            const res = await fetch("/api/logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLog),
            });

            if (res.ok) {
                setShowCreateModal(false);
                setNewLog({ targetUser: "", type: "Warn", reason: "", description: "" });
                fetchLogs();
                // Trigger PM check immediately
                fetch("/api/notifications/check", { method: "POST" }).catch(() => { });
            }
        } catch (err) {
            console.error("Failed to create log:", err);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.action.toLowerCase().includes(searchQuery.toLowerCase());

        // Basic filtering logic
        let matchesMember = true;
        if (filterMember === "Staff Only") {
            // This would ideally check staff status but for now we follow mock UI
        }

        return matchesSearch && matchesMember;
    });

    const stats = {
        total: logs.length,
        actions: logs.filter(l => l.type === 'other' || !['warn', 'kick', 'ban'].includes(l.type)).length,
        infractions: logs.filter(l => l.type === 'warn').length,
        punishments: logs.filter(l => ['kick', 'ban'].includes(l.type)).length
    };

    const formatTimestamp = (ts: string) => {
        try {
            const date = new Date(ts);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.round(diffMs / 60000);

            if (diffMins < 1) return "Just now";
            if (diffMins < 60) return `${diffMins}m ago`;

            const diffHours = Math.round(diffMins / 60);
            if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

            return date.toLocaleDateString();
        } catch (e) {
            return ts;
        }
    };

    const filteredPlayers = ingamePlayers.filter(p =>
        p?.username?.toLowerCase().includes((newLog.targetUser || "").toLowerCase())
    );

    if (loading || !user) {
        return (
            <div className="flex min-h-screen bg-[#0a0a0f] items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
            <Sidebar user={user} />

            <main className="flex-1 lg:ml-72 relative z-10 overflow-x-hidden pt-16 lg:pt-0 h-screen flex flex-col">
                {/* Background Image with Gradient Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                    style={{ backgroundImage: "url('/images/honolulu_sunset_background.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f] pointer-events-none" />

                <div className="p-6 lg:p-10 relative z-10 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-1">Logging</h1>
                    </div>

                    {/* Action Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div className="bg-[#1a1a2e]/40 backdrop-blur-md rounded-2xl border border-white/5 p-1 flex-1 flex items-center max-w-2xl px-4 py-1">
                            <span className="text-gray-500 mr-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search logs..."
                                className="bg-transparent border-none focus:ring-0 text-sm py-2 w-full text-white placeholder:text-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                className="bg-[#1a1a2e]/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                value={filterMember}
                                onChange={(e) => setFilterMember(e.target.value)}
                            >
                                <option>Any Member</option>
                                <option>Staff Only</option>
                                <option>Civilians</option>
                            </select>
                            <select
                                className="bg-[#1a1a2e]/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                value={filterAction}
                                onChange={(e) => setFilterAction(e.target.value)}
                            >
                                <option>All Actions</option>
                                <option>Infractions</option>
                                <option>Kicks/Bans</option>
                                <option>Moderation</option>
                            </select>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Log
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard label="Total Logs" value={stats.total.toString()} color="blue" />
                        <StatCard label="Actions Logged" value={stats.actions.toString()} color="emerald" />
                        <StatCard label="Infractions" value={stats.infractions.toString()} color="amber" />
                        <StatCard label="User Kicks / Bans" value={stats.punishments.toString()} color="rose" />
                    </div>

                    {/* Logs Table Container */}
                    <div className="bg-[#1a1a2e]/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden flex-1 flex flex-col min-h-0 shadow-2xl">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                            <h2 className="font-bold text-lg px-2">Logging</h2>
                            <div className="flex items-center gap-4">
                                <p className="text-gray-500 text-xs hidden sm:block">Showing {filteredLogs.length} of {logs.length} results</p>
                                <div className="flex gap-1">
                                    <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button className="w-8 h-8 rounded-lg bg-blue-600 border border-blue-500/50 flex items-center justify-center text-xs font-bold">1</button>
                                    <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto custom-scrollbar">
                            {logsLoading ? (
                                <div className="p-12 text-center text-gray-500 italic">Syncing with database...</div>
                            ) : filteredLogs.length === 0 ? (
                                <div className="p-12 text-center text-gray-500 italic">No results found for your search.</div>
                            ) : (
                                <table className="w-full text-left border-collapse min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.02]">
                                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-gray-500">User</th>
                                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-gray-500">Action</th>
                                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-gray-500">Notes</th>
                                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-gray-500">Timestamp</th>
                                            <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredLogs.map((log) => (
                                            <tr key={log._id || log.timestamp} className="hover:bg-white/[0.03] transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                                                            {log.user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white mb-0.5">{log.user.name}</p>
                                                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{formatTimestamp(log.timestamp)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="text-sm font-medium text-gray-200">{log.action}</p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-start gap-3 max-w-sm">
                                                        <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${['kick', 'ban'].includes(log.type) ? 'bg-amber-500/20 text-amber-500' : (log.type === 'warn' ? 'bg-rose-500/20 text-rose-500' : 'bg-green-500/20 text-green-500')}`}>
                                                            {['kick', 'ban'].includes(log.type) ? '⚠️' : (log.type === 'warn' ? '🚨' : '🛡️')}
                                                        </div>
                                                        <p className="text-xs text-gray-400 leading-relaxed italic line-clamp-2">{log.notes}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="text-xs text-gray-500 font-medium">{new Date(log.timestamp).toLocaleString()}</p>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <button className="bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-1.5 rounded-lg text-xs font-bold text-gray-300 transition-all group-hover:border-blue-500/30 group-hover:text-blue-400">
                                                        View Infraction
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/5 bg-black/20 text-center">
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">© 2024 Honolulu State Roleplay ~ Staff Portal built with Aloha</p>
                        </div>
                    </div>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in duration-300">
                        <div className="bg-[#1a1a2e]/90 border border-white/10 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                                <h2 className="text-2xl font-bold tracking-tight text-center flex-1">Create New Log</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-all text-gray-500 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* User Selection */}
                                    <div className="relative">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">User <span className="text-rose-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                {newLog.targetUser.charAt(0) || '?'}
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all hover:bg-black/60"
                                                placeholder="Search for user..."
                                                value={newLog.targetUser}
                                                onFocus={() => setShowPlayerDropdown(true)}
                                                onChange={(e) => {
                                                    setNewLog({ ...newLog, targetUser: e.target.value });
                                                    setShowPlayerDropdown(true);
                                                }}
                                            />
                                        </div>

                                        {/* Player Dropdown */}
                                        {showPlayerDropdown && (
                                            <div ref={dropdownRef} className="absolute z-[110] left-0 right-0 mt-2 bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                                                    {filteredPlayers.length > 0 ? (
                                                        filteredPlayers.map((player) => (
                                                            <button
                                                                key={player.id}
                                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
                                                                onClick={() => {
                                                                    setNewLog({ ...newLog, targetUser: player.username });
                                                                    setShowPlayerDropdown(false);
                                                                }}
                                                            >
                                                                <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-bold border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                                    {player.username.charAt(0)}
                                                                </div>
                                                                <span className="text-sm text-gray-300 group-hover:text-white">{player.username}</span>
                                                                <span className="ml-auto text-[10px] font-bold text-green-500 uppercase tracking-tighter">Online</span>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-xs text-gray-500 italic flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            No in-game players found. Manual entry enabled.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Log Type */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Type <span className="text-rose-500">*</span></label>
                                        <select
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all hover:bg-black/60 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat"
                                            value={newLog.type}
                                            onChange={(e) => setNewLog({ ...newLog, type: e.target.value })}
                                        >
                                            <option className="bg-[#1a1a2e]">Warn</option>
                                            <option className="bg-[#1a1a2e]">Kick</option>
                                            <option className="bg-[#1a1a2e]">Ban</option>
                                            <option className="bg-[#1a1a2e]">Internal</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Reason Selection */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Reason <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all hover:bg-black/60"
                                            placeholder="Select or type reason..."
                                            value={newLog.reason}
                                            onChange={(e) => setNewLog({ ...newLog, reason: e.target.value })}
                                        />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">Additional Information (Optional)</label>
                                    <textarea
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all hover:bg-black/60 resize-none h-32"
                                        placeholder="Add detailed description about the incident..."
                                        value={newLog.description}
                                        onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                                    />
                                </div>

                                {/* Media Upload */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 py-4 rounded-2xl transition-all text-sm font-bold text-gray-400 hover:text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Upload Images (Max 2)
                                    </button>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 py-4 rounded-2xl transition-all text-sm font-bold text-rose-400"
                                    >
                                        Exit User Panel
                                    </button>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-end">
                                <button
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99]"
                                    onClick={handleCreateLog}
                                    disabled={!newLog.targetUser || !newLog.reason}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: string; color: "blue" | "emerald" | "amber" | "rose" }) {
    const colors = {
        blue: "from-blue-500/40 to-blue-700/40 border-blue-500/20 text-blue-400",
        emerald: "from-emerald-500/40 to-emerald-700/40 border-emerald-500/20 text-emerald-400",
        amber: "from-amber-500/40 to-amber-700/40 border-amber-500/20 text-amber-500",
        rose: "from-rose-500/40 to-rose-700/40 border-rose-500/20 text-rose-400",
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} backdrop-blur-xl rounded-2xl p-6 border shadow-lg`}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">{label}</p>
            <p className="text-4xl font-black text-white">{value}</p>
        </div>
    );
}
