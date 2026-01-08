"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";

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

export default function StaffTrainingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");
  const [joined, setJoined] = useState(false);
  const [group, setGroup] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
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
        // Dynamically import CometChat UIKit for initialization
        const { CometChatUIKit, UIKitSettingsBuilder } = await import("@cometchat/chat-uikit-react");

        // Initialize UIKit (this also initializes the SDK)
        const UIKitSettings = new UIKitSettingsBuilder()
          .setAppId(COMETCHAT_APP_ID)
          .setRegion(COMETCHAT_REGION)
          .setAuthKey(COMETCHAT_AUTH_KEY)
          .subscribePresenceForAllUsers()
          .build();

        await CometChatUIKit.init(UIKitSettings);
        console.log("CometChat UIKit initialized successfully");

        // Also get CometChat SDK reference for other operations
        const CometChatModule = await import("@cometchat/chat-sdk-javascript");
        const CometChat = CometChatModule.CometChat || CometChatModule.default?.CometChat || CometChatModule.default;
        cometChatRef.current = CometChat;

        // Login to CometChat with user ID
        try {
          await CometChatUIKit.login(user.id);
          console.log("CometChat login successful");
          setCometChatReady(true);
        } catch (loginErr: any) {
          // If user doesn't exist in CometChat, create them
          if (loginErr.code === "ERR_UID_NOT_FOUND") {
            const cometUser = new CometChat.User(user.id);
            cometUser.setName(user.username);
            // Only set avatar if it's a valid URL
            if (user.avatar && (user.avatar.startsWith('http://') || user.avatar.startsWith('https://'))) {
              cometUser.setAvatar(user.avatar);
            }
            await CometChatUIKit.createUser(cometUser);
            await CometChatUIKit.login(user.id);
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

  const handleJoin = async () => {
    if (!sessionId.trim()) {
      setError("Please enter a session ID");
      return;
    }

    if (!cometChatReady || !cometChatRef.current) {
      setError("Chat system is not ready. Please wait or check configuration.");
      return;
    }

    setError(null);
    const CometChat = cometChatRef.current;

    try {
      // Try to fetch existing group
      let fetchedGroup = await CometChat.getGroup(sessionId);

      // Try to join the group if not already a member
      try {
        await CometChat.joinGroup(sessionId, CometChat.GROUP_TYPE.PUBLIC, "");
      } catch (joinErr: any) {
        // Ignore if already a member
        if (joinErr.code !== "ERR_ALREADY_JOINED") {
          console.log("Already a member or join handled");
        }
      }

      setGroup(fetchedGroup);
      setJoined(true);
    } catch (err: any) {
      // If group doesn't exist, create it
      if (err.code === "ERR_GUID_NOT_FOUND") {
        try {
          const newGroup = new CometChat.Group(
            sessionId,
            `Training: ${sessionId}`,
            CometChat.GROUP_TYPE.PUBLIC,
            ""
          );
          const createdGroup = await CometChat.createGroup(newGroup);
          setGroup(createdGroup);
          setJoined(true);
        } catch (createErr) {
          console.error("Failed to create group:", createErr);
          setError("Failed to create training session. Please try again.");
        }
      } else {
        console.error("Failed to join session:", err);
        setError("Failed to join session. Please try again.");
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

          {!joined ? (
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg w-full max-w-md border border-white/10">
              <h2 className="text-white text-2xl font-bold mb-2 text-center">Staff Training</h2>
              <p className="text-gray-400 text-sm text-center mb-6">
                Enter a session ID to join or create a training room
              </p>
              <input
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f]/50 text-white border border-white/10 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-500"
                placeholder="Enter Session ID"
                value={sessionId}
                onChange={e => setSessionId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleJoin()}
              />
              <button
                onClick={handleJoin}
                disabled={!isCometChatConfigured || !cometChatReady}
                className="w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cometChatReady ? "Join Session" : "Connecting..."}
              </button>
            </div>
          ) : (
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg w-full max-w-4xl border border-white/10 flex flex-col" style={{ height: "70vh" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white text-xl font-bold">Training Session</h2>
                  <p className="text-gray-400 text-sm">Session ID: {sessionId}</p>
                </div>
                <button
                  onClick={handleLeave}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all"
                >
                  Leave Session
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
