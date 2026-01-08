"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
import { AdminLevel } from "../config/roles";

// Dynamically import CometChat components to avoid SSR issues
const CometChatMessageList = dynamic(
    () => import("@cometchat/chat-uikit-react").then((mod) => mod.CometChatMessageList),
    { ssr: false }
);

const CometChatMessageComposer = dynamic(
    () => import("@cometchat/chat-uikit-react").then((mod) => mod.CometChatMessageComposer),
    { ssr: false }
);

// CometChat credentials from environment variables
const COMETCHAT_APP_ID = process.env.NEXT_PUBLIC_COMETCHAT_APP_ID || "16739610cda03399a";
const COMETCHAT_REGION = process.env.NEXT_PUBLIC_COMETCHAT_REGION || "US";
const COMETCHAT_AUTH_KEY = process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY || "7a53c8ebf0dd6ee8becd236bfd8577adf050c546";

interface User {
    id: string;
    username: string;
    avatar: string | null;
    adminLevel?: number;
}

export default function StaffTrainingHostPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState("");
    const [sessionName, setSessionName] = useState("");
    const [joined, setJoined] = useState(false);
    const [group, setGroup] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [cometChatReady, setCometChatReady] = useState(false);
    const cometChatRef = useRef<any>(null);

    // Fetch authenticated user
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                if (!res.ok) {
                    router.push("/");
                    return;
                }
                const userData = await res.json();

                // Check if user has IA+ permissions
                if ((userData.adminLevel ?? 0) < AdminLevel.INTERNAL_AFFAIRS) {
                    router.push("/dashboard");
                    return;
                }

                setUser(userData);
            } catch (err) {
                router.push("/");
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [router]);

    // Initialize CometChat
    useEffect(() => {
        if (!user || !COMETCHAT_APP_ID || !COMETCHAT_REGION) return;

        const initCometChat = async () => {
            try {
                // Dynamically import CometChat SDK to avoid SSR issues
                const { CometChat, AppSettingsBuilder } = await import("@cometchat/chat-sdk-javascript");
                cometChatRef.current = CometChat;

                const appSettings = new AppSettingsBuilder()
                    .subscribePresenceForAllUsers()
                    .setRegion(COMETCHAT_REGION)
                    .build();

                await CometChat.init(COMETCHAT_APP_ID, appSettings);
                console.log("CometChat initialized successfully");

                // Login to CometChat with user ID
                try {
                    await CometChat.login(user.id, COMETCHAT_AUTH_KEY);
                    console.log("CometChat login successful");
                    setCometChatReady(true);
                } catch (loginErr: any) {
                    // If user doesn't exist in CometChat, create them
                    if (loginErr.code === "ERR_UID_NOT_FOUND") {
                        const cometUser = new CometChat.User(user.id);
                        cometUser.setName(user.username);
                        if (user.avatar) {
                            cometUser.setAvatar(user.avatar);
                        }
                        await CometChat.createUser(cometUser, COMETCHAT_AUTH_KEY);
                        await CometChat.login(user.id, COMETCHAT_AUTH_KEY);
                        console.log("CometChat user created and logged in");
                        setCometChatReady(true);
                    } else {
                        throw loginErr;
                    }
                }
            } catch (err) {
                console.error("CometChat initialization error:", err);
                setError("Failed to initialize chat system. Please check configuration.");
            }
        };

        initCometChat();
    }, [user]);

    const generateSessionId = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "HSRP-";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setSessionId(result);
        setSuccess(`Session ID generated: ${result}`);
        setTimeout(() => setSuccess(null), 3000);
    };

    const handleCreateSession = async () => {
        if (!sessionId.trim()) {
            setError("Please enter or generate a session ID");
            return;
        }

        if (!cometChatReady || !cometChatRef.current) {
            setError("Chat system is not ready. Please wait or check configuration.");
            return;
        }

        setError(null);
        const CometChat = cometChatRef.current;

        try {
            // Create a new group for the training session
            const newGroup = new CometChat.Group(
                sessionId,
                sessionName || `Training: ${sessionId}`,
                CometChat.GROUP_TYPE.PUBLIC,
                ""
            );
            const createdGroup = await CometChat.createGroup(newGroup);
            setGroup(createdGroup);
            setJoined(true);
            setSuccess("Training session created successfully!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            if (err.code === "ERR_GUID_ALREADY_EXISTS") {
                // Group already exists, try to join it
                try {
                    const existingGroup = await CometChat.getGroup(sessionId);
                    try {
                        await CometChat.joinGroup(sessionId, CometChat.GROUP_TYPE.PUBLIC, "");
                    } catch (joinErr: any) {
                        if (joinErr.code !== "ERR_ALREADY_JOINED") {
                            console.log("Already a member or join handled");
                        }
                    }
                    setGroup(existingGroup);
                    setJoined(true);
                } catch (fetchErr) {
                    setError("Failed to join existing session.");
                }
            } else {
                console.error("Failed to create session:", err);
                setError("Failed to create training session. Please try again.");
            }
        }
    };

    const handleLeave = async () => {
        if (group && cometChatRef.current) {
            try {
                await cometChatRef.current.leaveGroup(group.getGuid());
            } catch (err) {
                console.log("Leave group handled");
            }
        }
        setJoined(false);
        setGroup(null);
        setSessionId("");
        setSessionName("");
    };

    const copySessionId = () => {
        navigator.clipboard.writeText(sessionId);
        setSuccess("Session ID copied to clipboard!");
        setTimeout(() => setSuccess(null), 2000);
    };

    // Check if CometChat is configured
    const isCometChatConfigured = COMETCHAT_APP_ID && COMETCHAT_REGION && COMETCHAT_AUTH_KEY;

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#0a0a0f] items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0a0a0f]">
            <Sidebar user={user || { username: "", avatar: null, id: "", adminLevel: undefined }} />
            <main className="flex-1 lg:ml-72 relative overflow-hidden pt-16 lg:pt-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
                <div className="relative z-10 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-screen">

                    {/* Configuration Warning */}
                    {!isCometChatConfigured && (
                        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6 max-w-md w-full">
                            <p className="text-yellow-400 text-sm text-center">
                                ⚠️ CometChat is not configured. Please set the following environment variables:
                            </p>
                            <ul className="text-yellow-300/80 text-xs mt-2 space-y-1">
                                <li>• NEXT_PUBLIC_COMETCHAT_APP_ID</li>
                                <li>• NEXT_PUBLIC_COMETCHAT_REGION</li>
                                <li>• NEXT_PUBLIC_COMETCHAT_AUTH_KEY</li>
                            </ul>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 max-w-md w-full">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 max-w-md w-full">
                            <p className="text-green-400 text-sm text-center">{success}</p>
                        </div>
                    )}

                    {!joined ? (
                        <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg w-full max-w-md border border-white/10">
                            <div className="flex items-center justify-center mb-2">
                                <span className="bg-purple-500/20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30">
                                    IA+ Only
                                </span>
                            </div>
                            <h2 className="text-white text-2xl font-bold mb-2 text-center">Host Training Session</h2>
                            <p className="text-gray-400 text-sm text-center mb-6">
                                Create and manage training sessions for staff members
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Session Name (Optional)</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f]/50 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-500"
                                        placeholder="e.g., Moderator Training Week 1"
                                        value={sessionName}
                                        onChange={e => setSessionName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Session ID</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 px-4 py-3 rounded-xl bg-[#0a0a0f]/50 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-500"
                                            placeholder="Enter or generate Session ID"
                                            value={sessionId}
                                            onChange={e => setSessionId(e.target.value)}
                                        />
                                        <button
                                            onClick={generateSessionId}
                                            className="px-4 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 transition-all"
                                            title="Generate ID"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateSession}
                                    disabled={!isCometChatConfigured || !cometChatReady}
                                    className="w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cometChatReady ? "Create & Join Session" : "Connecting..."}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg w-full max-w-4xl border border-white/10 flex flex-col" style={{ height: "80vh" }}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-white text-xl font-bold">
                                            {sessionName || "Training Session"}
                                        </h2>
                                        <span className="bg-purple-500/20 text-purple-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-purple-500/30">
                                            Host
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-400 text-sm">Session ID: {sessionId}</p>
                                        <button
                                            onClick={copySessionId}
                                            className="text-purple-400 hover:text-purple-300 transition-colors"
                                            title="Copy Session ID"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLeave}
                                    className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all"
                                >
                                    End Session
                                </button>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden bg-[#0a0a0f]/50 flex flex-col">
                                {group ? (
                                    <>
                                        <div className="flex-1 overflow-auto">
                                            <CometChatMessageList group={group} />
                                        </div>
                                        <div className="border-t border-white/10">
                                            <CometChatMessageComposer group={group} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-gray-400">Loading chat...</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
