"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { parsePlayer, formatTimestamp } from "../config/erlc";
import { AdminLevel } from "../config/roles";
import type { ServerStatus, Player, JoinLog, KillLog, CommandLog, ModCall } from "../config/erlc";

interface User {
  id: string;
  username: string;
  avatar: string | null;
  adminLevel?: number;
}

interface Reminder {
  id: string;
  message: string;
  interval: number;
  active: boolean;
  lastSent: number;
  createdAt: string;
  author: string;
}

type TabType = "overview" | "players" | "logs" | "commands" | "bans" | "reminders";

// Commands organized by required rank
interface QuickCommand {
  label: string;
  cmd: string;
  requiredLevel: AdminLevel;
  description?: string;
}

const ERLC_SERVER_KEY = process.env.NEXT_PUBLIC_ERLC_SERVER_KEY;
const QUICK_COMMANDS: QuickCommand[] = [
  // Moderator/Administrator (Level 2+) - View commands
  { label: "View", cmd: ":view ", requiredLevel: AdminLevel.MODERATOR, description: "View a player" },
  { label: "Bans", cmd: ":bans", requiredLevel: AdminLevel.MODERATOR, description: "View bans" },
  { label: "Cmds", cmd: ":cmds", requiredLevel: AdminLevel.MODERATOR, description: "View commands" },
  { label: "Logs", cmd: ":logs", requiredLevel: AdminLevel.MODERATOR, description: "View logs" },
  { label: "Admins", cmd: ":admins", requiredLevel: AdminLevel.MODERATOR, description: "List admins" },
  { label: "Mods", cmd: ":mods", requiredLevel: AdminLevel.MODERATOR, description: "List mods" },
  { label: "PM", cmd: ":pm ", requiredLevel: AdminLevel.MODERATOR, description: "Private message" },

  // Internal Affairs (Level 4+)
  { label: "Kick", cmd: ":kick ", requiredLevel: AdminLevel.INTERNAL_AFFAIRS, description: "Kick player" },
  { label: "Refresh", cmd: ":refresh ", requiredLevel: AdminLevel.INTERNAL_AFFAIRS, description: "Refresh player" },
  { label: "Unjail", cmd: ":unjail ", requiredLevel: AdminLevel.INTERNAL_AFFAIRS, description: "Unjail player" },
  { label: "Mod", cmd: ":mod ", requiredLevel: AdminLevel.INTERNAL_AFFAIRS, description: "Give mod" },
  { label: "Unmod", cmd: ":unmod ", requiredLevel: AdminLevel.INTERNAL_AFFAIRS, description: "Remove mod" },
  { label: "Admin", cmd: ":admin ", requiredLevel: AdminLevel.INTERNAL_AFFAIRS, description: "Give admin" },
  { label: "Unadmin", cmd: ":unadmin ", requiredLevel: AdminLevel.INTERNAL_AFFAIRS, description: "Remove admin" },

  // Management (Level 5+)
  { label: "Priority", cmd: ":pt ", requiredLevel: AdminLevel.MANAGEMENT, description: "Priority" },
  { label: "Party", cmd: ":prty ", requiredLevel: AdminLevel.MANAGEMENT, description: "Party" },
  { label: "Hint", cmd: ":h ", requiredLevel: AdminLevel.MANAGEMENT, description: "Hint message" },
  { label: "Message", cmd: ":m ", requiredLevel: AdminLevel.MANAGEMENT, description: "Server message" },
  { label: "Load", cmd: ":load ", requiredLevel: AdminLevel.MANAGEMENT, description: "Load command" },

  // Direction Board (Level 6+)
  { label: "Bring", cmd: ":bring ", requiredLevel: AdminLevel.DIRECTION_BOARD, description: "Bring player" },
  { label: "Heal", cmd: ":heal ", requiredLevel: AdminLevel.DIRECTION_BOARD, description: "Heal player" },
  { label: "Wanted", cmd: ":wanted ", requiredLevel: AdminLevel.DIRECTION_BOARD, description: "Set wanted" },
  { label: "Unwanted", cmd: ":unwanted ", requiredLevel: AdminLevel.DIRECTION_BOARD, description: "Remove wanted" },
  { label: "To Car", cmd: ":tocar ", requiredLevel: AdminLevel.DIRECTION_BOARD, description: "Teleport to car" },
  { label: "To ATV", cmd: ":toatv ", requiredLevel: AdminLevel.DIRECTION_BOARD, description: "Teleport to ATV" },
  { label: "To", cmd: ":to ", requiredLevel: AdminLevel.DIRECTION_BOARD, description: "Teleport to player" },
  { label: "Ban", cmd: ":ban ", requiredLevel: AdminLevel.DIRECTION_BOARD, description: "Ban player" },
  { label: "Unban", cmd: ":unban ", requiredLevel: AdminLevel.DIRECTION_BOARD, description: "Unban player" },
];

export default function ServerManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [joinLogs, setJoinLogs] = useState<JoinLog[]>([]);
  const [killLogs, setKillLogs] = useState<KillLog[]>([]);
  const [commandLogs, setCommandLogs] = useState<CommandLog[]>([]);
  const [modCalls, setModCalls] = useState<ModCall[]>([]);
  const [bans, setBans] = useState<Record<string, string>>({});
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderStatus, setReminderStatus] = useState<string>("");
  const reminderIndexRef = useRef(0);
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [reminderInput, setReminderInput] = useState({ message: "", interval: "10" });
  const [reminderLoading, setReminderLoading] = useState(false);

  // Command input
  const [commandInput, setCommandInput] = useState("");
  const [commandLoading, setCommandLoading] = useState(false);
  const [commandMessage, setCommandMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Log type filter
  const [logType, setLogType] = useState<"join" | "kill" | "command" | "modcall">("join");

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
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [serverRes, playersRes] = await Promise.all([
        fetch("/api/erlc/server"),
        fetch("/api/erlc/players"),
      ]);

      if (serverRes.ok) {
        setServerStatus(await serverRes.json());
      }
      if (playersRes.ok) {
        setPlayers(await playersRes.json());
      }
    } catch (err) {
      setError("Failed to fetch server data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const [joinRes, killRes, cmdRes, modRes] = await Promise.all([
        fetch("/api/erlc/joinlogs"),
        fetch("/api/erlc/killlogs"),
        fetch("/api/erlc/commandlogs"),
        fetch("/api/erlc/modcalls"),
      ]);

      if (joinRes.ok) setJoinLogs(await joinRes.json());
      if (killRes.ok) setKillLogs(await killRes.json());
      if (cmdRes.ok) setCommandLogs(await cmdRes.json());
      if (modRes.ok) setModCalls(await modRes.json());
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  }, []);

  const fetchBans = useCallback(async () => {
    try {
      const res = await fetch("/api/erlc/bans");
      if (res.ok) {
        setBans(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch bans:", err);
    }
  }, []);

  const fetchReminders = useCallback(async () => {
    // Reminders are stored client-side only
    const stored = localStorage.getItem("reminders");
    if (stored) {
      setReminders(JSON.parse(stored));
    } else {
      setReminders([]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
      fetchLogs();
      fetchBans();
      fetchReminders();

      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchData();
        fetchLogs();
        fetchReminders();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, fetchData, fetchLogs, fetchBans, fetchReminders]);

  const handleAddReminder = async () => {
    if (!reminderInput.message.trim()) return;
    if ((user?.adminLevel ?? 0) < AdminLevel.MANAGEMENT) {
      setError("You don't have permission to manage reminders");
      return;
    }
    const newReminder = {
      id: Date.now().toString(),
      message: reminderInput.message,
      interval: parseInt(reminderInput.interval) || 120,
      active: true,
      lastSent: 0,
      createdAt: new Date().toISOString(),
      author: user?.username || "Unknown"
    };
    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
    setReminderInput({ message: "", interval: "10" });
    setCommandMessage({ type: "success", text: "Reminder added. It will be sent automatically every 2 minutes." });
  };

  const toggleReminder = async (reminder: Reminder) => {
    if ((user?.adminLevel ?? 0) < AdminLevel.MANAGEMENT) {
      setError("You don't have permission to manage reminders");
      return;
    }
    const updated = reminders.map(r => r.id === reminder.id ? { ...r, active: !r.active } : r);
    setReminders(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
  };

  const deleteReminder = async (id: string) => {
    if ((user?.adminLevel ?? 0) < AdminLevel.MANAGEMENT) {
      setError("You don't have permission to manage reminders");
      return;
    }
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
  };

  const handleTriggerProcess = async () => {
    setReminderLoading(true);
    try {
      const activeReminders = reminders.filter(r => r.active);
      for (const reminder of activeReminders) {
        const command = `:h ${reminder.message}`;
        await fetch("https://api.policeroleplay.community/v1/server/command", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": process.env.ERLC_SERVER_KEY || ""
          },
          body: JSON.stringify({ command }),
        });
      }
      setCommandMessage({ type: "success", text: `Triggered all active reminders via :h.` });
    } catch {
      setError("Failed to trigger reminders");
    } finally {
      setReminderLoading(false);
    }
  };
  // Auto-send reminders every 2 minutes (120000 ms)
  useEffect(() => {
    if (reminderIntervalRef.current) {
      clearInterval(reminderIntervalRef.current);
    }
    if (reminders.length === 0) return;
    reminderIndexRef.current = 0;
    reminderIntervalRef.current = setInterval(async () => {
      const activeReminders = reminders.filter(r => r.active);
      if (activeReminders.length === 0) return;
      const idx = reminderIndexRef.current % activeReminders.length;
      const reminder = activeReminders[idx];
      reminderIndexRef.current++;
      const command = `:h ${reminder.message}`;
      try {
        await fetch("https://api.policeroleplay.community/v1/server/command", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": ERLC_SERVER_KEY || ""
          },
          body: JSON.stringify({ command }),
        });
        setReminderStatus(`Sent reminder: ${reminder.message}`);
      } catch {
        setReminderStatus(`Failed to send reminder: ${reminder.message}`);
      }
    }, 120000);
    return () => {
      if (reminderIntervalRef.current) clearInterval(reminderIntervalRef.current);
    };
  }, [reminders]);

  const executeCommand = async () => {
    if (!commandInput.trim()) return;

    // Check if user has permission for this command
    const commandBase = commandInput.trim().split(" ")[0].toLowerCase();
    const matchedCommand = QUICK_COMMANDS.find(cmd =>
      cmd.cmd.trim().toLowerCase() === commandBase ||
      cmd.cmd.trim().toLowerCase().startsWith(commandBase + " ")
    );

    if (matchedCommand && (user?.adminLevel ?? 0) < matchedCommand.requiredLevel) {
      setCommandMessage({ type: "error", text: "You don't have permission to use this command" });
      return;
    }

    setCommandLoading(true);
    setCommandMessage(null);

    try {
      const res = await fetch("/api/erlc/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: commandInput }),
      });

      if (res.ok) {
        setCommandMessage({ type: "success", text: "Command executed successfully!" });
        setCommandInput("");
      } else {
        const data = await res.json();
        setCommandMessage({ type: "error", text: data.error || "Failed to execute command" });
      }
    } catch {
      setCommandMessage({ type: "error", text: "Failed to execute command" });
    } finally {
      setCommandLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const tabs: { id: TabType; name: string; icon: string }[] = [
    { id: "overview", name: "Overview", icon: "chart" },
    { id: "players", name: "Players", icon: "users" },
    { id: "logs", name: "Logs", icon: "list" },
    { id: "commands", name: "Commands", icon: "terminal" },
    { id: "bans", name: "Bans", icon: "ban" },
    { id: "reminders", name: "Reminders", icon: "clock" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
      <Sidebar user={user} />

      <main className="flex-1 lg:ml-72 relative overflow-hidden pt-16 lg:pt-0">
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
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Server Management 🖥️</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage your ERLC private server</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-[#1a1a2e]/80 backdrop-blur-sm p-1 rounded-xl w-fit overflow-x-auto border border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Server Status Card */}
              <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Server Status</p>
                    <p className="text-white font-semibold">{loading ? "Loading..." : serverStatus ? "Online" : "Offline"}</p>
                  </div>
                </div>
                {serverStatus && (
                  <p className="text-gray-500 text-sm truncate">{serverStatus.Name}</p>
                )}
              </div>

              {/* Players Card */}
              <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Players Online</p>
                    <p className="text-white font-semibold">
                      {loading ? "..." : `${serverStatus?.CurrentPlayers || 0}/${serverStatus?.MaxPlayers || 0}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Join Key Card */}
              <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Join Key</p>
                    <p className="text-white font-semibold font-mono">{loading ? "..." : serverStatus?.JoinKey || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Mod Calls Card */}
              <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Pending Mod Calls</p>
                    <p className="text-white font-semibold">{modCalls.filter(m => !m.Moderator).length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Players Tab */}
          {activeTab === "players" && (
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 shadow-xl">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-white font-semibold">Current Players ({players.length})</h2>
                <button
                  onClick={fetchData}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0a0a0f]/50">
                    <tr>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Player</th>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Team</th>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Callsign</th>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Permission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-500 py-8">
                          No players online
                        </td>
                      </tr>
                    ) : (
                      players.map((player, i) => {
                        const { name } = parsePlayer(player.Player);
                        return (
                          <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-white">{name}</td>
                            <td className="px-4 py-3 text-gray-400">{player.Team}</td>
                            <td className="px-4 py-3 text-gray-400">{player.Callsign || "-"}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-lg text-xs ${player.Permission === "Server Owner" ? "bg-yellow-500/20 text-yellow-400" :
                                player.Permission === "Server Administrator" ? "bg-red-500/20 text-red-400" :
                                  player.Permission === "Server Moderator" ? "bg-blue-500/20 text-blue-400" :
                                    "bg-gray-500/20 text-gray-400"
                                }`}>
                                {player.Permission}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 shadow-xl">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex gap-2">
                  {(["join", "kill", "command", "modcall"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setLogType(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${logType === type
                        ? "bg-blue-600/80 text-white"
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      {type === "join" ? "Join Logs" :
                        type === "kill" ? "Kill Logs" :
                          type === "command" ? "Command Logs" : "Mod Calls"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={fetchLogs}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {logType === "join" && (
                  <div className="divide-y divide-white/5">
                    {joinLogs.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No join logs</p>
                    ) : (
                      joinLogs.slice().reverse().map((log, i) => {
                        const { name } = parsePlayer(log.Player);
                        return (
                          <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors">
                            <span className={`w-2 h-2 rounded-full ${log.Join ? "bg-green-500" : "bg-red-500"}`} />
                            <span className="text-white">{name}</span>
                            <span className="text-gray-500 text-sm">{log.Join ? "joined" : "left"}</span>
                            <span className="text-gray-600 text-xs ml-auto">{formatTimestamp(log.Timestamp)}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
                {logType === "kill" && (
                  <div className="divide-y divide-white/5">
                    {killLogs.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No kill logs</p>
                    ) : (
                      killLogs.slice().reverse().map((log, i) => {
                        const killer = parsePlayer(log.Killer);
                        const killed = parsePlayer(log.Killed);
                        return (
                          <div key={i} className="px-4 py-3 flex items-center gap-2 hover:bg-white/5 transition-colors">
                            <span className="text-red-400">{killer.name}</span>
                            <span className="text-gray-500">killed</span>
                            <span className="text-white">{killed.name}</span>
                            <span className="text-gray-600 text-xs ml-auto">{formatTimestamp(log.Timestamp)}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
                {logType === "command" && (
                  <div className="divide-y divide-white/5">
                    {commandLogs.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No command logs</p>
                    ) : (
                      commandLogs.slice().reverse().map((log, i) => {
                        const { name } = parsePlayer(log.Player);
                        return (
                          <div key={i} className="px-4 py-3 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-400">{name}</span>
                              <span className="text-gray-600 text-xs ml-auto">{formatTimestamp(log.Timestamp)}</span>
                            </div>
                            <code className="text-gray-400 text-sm font-mono">{log.Command}</code>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
                {logType === "modcall" && (
                  <div className="divide-y divide-white/5">
                    {modCalls.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No mod calls</p>
                    ) : (
                      modCalls.slice().reverse().map((log, i) => {
                        const caller = parsePlayer(log.Caller);
                        const moderator = log.Moderator ? parsePlayer(log.Moderator) : null;
                        return (
                          <div key={i} className="px-4 py-3 flex items-center gap-2 hover:bg-white/5 transition-colors">
                            <span className="text-yellow-400">{caller.name}</span>
                            <span className="text-gray-500">called for mod</span>
                            {moderator && (
                              <>
                                <span className="text-gray-500">→</span>
                                <span className="text-green-400">{moderator.name}</span>
                                <span className="text-gray-500">responded</span>
                              </>
                            )}
                            {!moderator && (
                              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs">Pending</span>
                            )}
                            <span className="text-gray-600 text-xs ml-auto">{formatTimestamp(log.Timestamp)}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Commands Tab */}
          {activeTab === "commands" && (
            <div className="space-y-6">
              <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl">
                <h2 className="text-white font-semibold mb-4">Execute Command</h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && executeCommand()}
                    placeholder="Enter command (e.g., :h Hello everyone!)"
                    className="flex-1 bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <button
                    onClick={executeCommand}
                    disabled={commandLoading || !commandInput.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {commandLoading ? "Executing..." : "Execute"}
                  </button>
                </div>
                {commandMessage && (
                  <div className={`mt-4 px-4 py-3 rounded-xl ${commandMessage.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                    {commandMessage.text}
                  </div>
                )}
              </div>

              {/* Quick Commands */}
              <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl">
                <h2 className="text-white font-semibold mb-4">Quick Commands</h2>
                <p className="text-gray-500 text-sm mb-4">Commands available based on your rank</p>

                {/* Group commands by rank */}
                {[
                  { level: AdminLevel.MODERATOR, title: "Moderator Commands", color: "blue" },
                  { level: AdminLevel.INTERNAL_AFFAIRS, title: "Internal Affairs Commands", color: "purple" },
                  { level: AdminLevel.MANAGEMENT, title: "Management Commands", color: "orange" },
                  { level: AdminLevel.DIRECTION_BOARD, title: "Direction Board Commands", color: "red" },
                ].map((group) => {
                  const commands = QUICK_COMMANDS.filter(
                    (cmd) => cmd.requiredLevel === group.level && (user?.adminLevel ?? 0) >= cmd.requiredLevel
                  );

                  if (commands.length === 0) return null;

                  return (
                    <div key={group.level} className="mb-6 last:mb-0">
                      <h3 className={`text-sm font-medium mb-3 ${group.color === "blue" ? "text-blue-400" :
                        group.color === "purple" ? "text-purple-400" :
                          group.color === "orange" ? "text-orange-400" :
                            "text-red-400"
                        }`}>
                        {group.title}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {commands.map((quick) => (
                          <button
                            key={quick.label}
                            onClick={() => setCommandInput(quick.cmd)}
                            className={`px-4 py-3 rounded-xl text-sm text-left border transition-all ${group.color === "blue" ? "bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20" :
                              group.color === "purple" ? "bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20" :
                                group.color === "orange" ? "bg-orange-500/10 text-orange-300 border-orange-500/20 hover:bg-orange-500/20" :
                                  "bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/20"
                              }`}
                          >
                            {quick.label}
                            <span className="text-gray-500 text-xs block font-mono">{quick.cmd}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Show message if no commands available */}
                {QUICK_COMMANDS.filter(cmd => (user?.adminLevel ?? 0) >= cmd.requiredLevel).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No commands available for your rank</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reminders Tab */}
          {activeTab === "reminders" && (
            <div className="space-y-6">
              {/* Add Reminder Card */}
              <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/5 shadow-xl">
                <h2 className="text-white font-semibold mb-4">Add Auto-Reminder ⏰</h2>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label className="text-gray-400 text-xs mb-1.5 block">Message</label>
                    <input
                      type="text"
                      value={reminderInput.message}
                      onChange={(e) => setReminderInput({ ...reminderInput, message: e.target.value })}
                      placeholder=":h Please join our Discord server!"
                      className="w-full bg-[#0a0a0f]/50 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1.5 block">Interval (sec)</label>
                    <input
                      type="number"
                      value={reminderInput.interval}
                      onChange={(e) => setReminderInput({ ...reminderInput, interval: e.target.value })}
                      placeholder="10"
                      min="1"
                      className="w-full bg-[#0a0a0f]/50 text-white px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddReminder}
                      disabled={reminderLoading || !reminderInput.message.trim()}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {reminderLoading ? "Adding..." : "Add Reminder"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reminders List */}
              {reminderStatus && (
                <div className="mb-4 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {reminderStatus}
                </div>
              )}
              <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-white font-semibold">Scheduled Reminders</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleTriggerProcess}
                      disabled={reminderLoading}
                      className="text-blue-400 hover:text-white text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 border border-blue-500/20 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {reminderLoading ? "Processing..." : "Trigger Process"}
                    </button>
                    <button
                      onClick={fetchReminders}
                      className="text-gray-400 hover:text-white text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0a0a0f]/50">
                      <tr>
                        <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Status</th>
                        <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Message</th>
                        <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Interval (s)</th>
                        <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Last Sent</th>
                        <th className="text-right text-gray-400 text-xs font-medium px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reminders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-gray-500 py-8">
                            No reminders scheduled
                          </td>
                        </tr>
                      ) : (
                        reminders.map((reminder) => (
                          <tr key={reminder.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3">
                              <button
                                onClick={() => toggleReminder(reminder)}
                                className={`w-10 h-5 rounded-full relative transition-colors ${reminder.active ? "bg-green-500" : "bg-gray-600"
                                  }`}
                              >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${reminder.active ? "left-6" : "left-1"
                                  }`} />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-white text-sm max-w-md truncate">{reminder.message}</td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{reminder.interval}s</td>
                            <td className="px-4 py-3 text-gray-500 text-xs">
                              {reminder.lastSent ? new Date(reminder.lastSent).toLocaleString() : "Never"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => deleteReminder(reminder.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-blue-400 font-semibold">How it works</h3>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                      Reminders are sent to the in-game server using the <code className="text-blue-300 font-mono">:h</code> command.
                      The interval determines how many seconds to wait between each message.
                      Messages will only be sent if the reminder is marked as <span className="text-green-400">Active</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bans Tab */}
          {activeTab === "bans" && (
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 shadow-xl">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-white font-semibold">Banned Players ({Object.keys(bans).length})</h2>
                <button
                  onClick={fetchBans}
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0a0a0f]/50">
                    <tr>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Player ID</th>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Username</th>
                      <th className="text-left text-gray-400 text-xs font-medium px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(bans).length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-gray-500 py-8">
                          No banned players
                        </td>
                      </tr>
                    ) : (
                      Object.entries(bans).map(([playerId, playerName]) => (
                        <tr key={playerId} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-gray-400 font-mono">{playerId}</td>
                          <td className="px-4 py-3 text-white">{playerName}</td>
                          <td className="px-4 py-3">
                            {(user?.adminLevel ?? 0) >= AdminLevel.DIRECTION_BOARD ? (
                              <button
                                onClick={() => setCommandInput(`:unban ${playerName}`)}
                                className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                              >
                                Unban
                              </button>
                            ) : (
                              <span className="text-gray-500 text-sm">No permission</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
