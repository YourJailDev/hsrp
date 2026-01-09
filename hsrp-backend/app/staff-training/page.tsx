"use client";

import "@cometchat/chat-uikit-react/css-variables.css";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
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
  const [members, setMembers] = useState<any[]>([]);
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
        // Dynamically import CometChat UIKit for initialization
        const module = await import("@cometchat/chat-uikit-react");
        const { CometChatUIKit, UIKitSettingsBuilder } = module;
        const CometChatSoundManager = (module as any).CometChatSoundManager;

        // Mute sounds to prevent NotAllowedError (browser autoplay policy)
        try {
          if (CometChatSoundManager) {
            CometChatSoundManager.onIncomingMessage = () => { };
            CometChatSoundManager.onOutgoingMessage = () => { };
            CometChatSoundManager.onIncomingOtherMessage = () => { };
            CometChatSoundManager.onIncomingCall = () => { };
            CometChatSoundManager.onOutgoingCall = () => { };
          }
        } catch (e) {
          console.warn("Could not mute CometChat sounds:", e);
        }

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

          // Sync user details (avatar) for existing users
          const avatarUrl = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            : null;

          if (avatarUrl) {
            const updatedUser = new CometChat.User(user.id);
            updatedUser.setName(user.username);
            updatedUser.setAvatar(avatarUrl);
            try {
              await CometChat.updateUser(updatedUser, COMETCHAT_AUTH_KEY);
              console.log("User avatar updated successfully");

              // Force re-login to ensure UI reflects the new avatar immediately
              await CometChatUIKit.logout();
              await CometChatUIKit.login(user.id);
            } catch (e) {
              console.log("Failed to update user avatar", e);
            }
          }

          setCometChatReady(true);
        } catch (loginErr: any) {
          // If user doesn't exist in CometChat, create them
          if (loginErr.code === "ERR_UID_NOT_FOUND") {
            const cometUser = new CometChat.User(user.id);
            cometUser.setName(user.username);

            // Construct valid Discord avatar URL
            const avatarUrl = user.avatar
              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
              : null;

            if (avatarUrl) {
              cometUser.setAvatar(avatarUrl);
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
      fetchMembers(sessionId);
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
          fetchMembers(sessionId);
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

  const fetchMembers = async (guid: string) => {
    if (!cometChatRef.current) return;
    const CometChat = cometChatRef.current;
    try {
      const membersRequest = new CometChat.GroupMembersRequestBuilder(guid)
        .setLimit(30)
        .build();
      const memberList = await membersRequest.fetchNext();
      setMembers(memberList);
    } catch (err) {
      console.error("Failed to fetch group members:", err);
    }
  };

  // Add CometChat listeners for real-time updates
  useEffect(() => {
    if (!joined || !group || !cometChatRef.current) return;

    const CometChat = cometChatRef.current;
    const listenerID = `training_${group.getGuid()}_${Date.now()}`;

    CometChat.addGroupListener(
      listenerID,
      new CometChat.GroupListener({
        onGroupMemberJoined: (message: any, joinedUser: any, joinedGroup: any) => {
          if (joinedGroup.getGuid() === group.getGuid()) {
            setMembers(prev => {
              if (prev.find(m => m.uid === joinedUser.uid)) return prev;
              return [...prev, joinedUser];
            });
          }
        },
        onGroupMemberLeft: (message: any, leftUser: any, leftGroup: any) => {
          if (leftGroup.getGuid() === group.getGuid()) {
            setMembers(prev => prev.filter(m => m.uid !== leftUser.uid));
          }
        },
        onGroupMemberKicked: (message: any, kickedUser: any, kickedBy: any, kickedGroup: any) => {
          if (kickedGroup.getGuid() === group.getGuid()) {
            setMembers(prev => prev.filter(m => m.uid !== kickedUser.uid));
            if (kickedUser.uid === user?.id) {
              handleLeave();
            }
          }
        }
      })
    );

    return () => {
      CometChat.removeGroupListener(listenerID);
    };
  }, [joined, group, user?.id]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollToBottom = () => {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth"
      });
    };

    // MutationObserver to watch for new messages in the DOM
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    observer.observe(scrollContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Initial scroll
    setTimeout(scrollToBottom, 100);

    return () => observer.disconnect();
  }, [joined, group]);

  const handleLeave = async () => {
    if (group && cometChatRef.current) {
      const CometChat = cometChatRef.current;
      try {
        // Only attempt to leave if group still exists (not already deleted by host)
        try {
          await CometChat.getGroup(group.getGuid());
          await CometChat.leaveGroup(group.getGuid());
        } catch (e) {
          // Group might be already deleted or user already left
        }
      } catch (err) {
        console.log("Leave group error handled");
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
    <div className="flex min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <Sidebar user={user || { username: "", avatar: null, id: "", adminLevel: undefined }} />

      <main className="flex-1 lg:ml-72 relative z-10 overflow-hidden min-h-screen flex flex-col pt-16 lg:pt-0">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: "url('/images/honolulu_sunset_background.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f] pointer-events-none" />

        <div className="p-6 lg:p-12 flex-1 flex flex-col max-h-screen overflow-hidden relative z-10">

          {/* Page Header */}
          <div className="mb-4">
            <h1 className="text-4xl font-bold mb-1">Staff Training</h1>
            <p className="text-gray-300 text-sm">Join a live training session hosted by your HSRP leadership team</p>
          </div>

          {!joined ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Join Card */}
              <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl w-full max-w-md border border-white/5">
                <h2 className="text-2xl font-bold mb-2 text-center text-white">Classroom Access</h2>
                <p className="text-gray-400 text-sm text-center mb-6 px-4">
                  Enter a session ID to join your assigned training room
                </p>
                <div className="space-y-4">
                  <input
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-500 transition-all"
                    placeholder="Session ID (e.g. MOD-101)"
                    value={sessionId}
                    onChange={e => setSessionId(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleJoin()}
                  />
                  <button
                    onClick={handleJoin}
                    disabled={!isCometChatConfigured || !cometChatReady}
                    className="w-full py-4 rounded-2xl font-bold transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cometChatReady ? "Join Classroom" : "Connecting..."}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Classroom Card */}
              <div className="bg-[#1a1a2e]/50 backdrop-blur-sm rounded-2xl border border-white/5 shadow-2xl flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col border-r border-white/10 min-h-0">

                  {/* Classroom Header */}
                  <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-500 h-2 w-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                        <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">Live</span>
                        <span className="text-white font-bold ml-2">
                          {members.find(m => m.uid === group?.owner)?.name || "Training"}'s Classroom
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          {group?.owner === user?.id ? "Hosting" : "Now Attending"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLeave}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 transition-all"
                    >
                      Leave Session
                    </button>
                  </div>

                  {/* Chat Info Area */}
                  <div className="p-4 px-6 flex items-center gap-4 bg-white/5 shrink-0">
                    <Image
                      src="https://images-ext-1.discordapp.net/external/zHtYuWHJ4jcw2EiyELgUy7WaF2oWpO8br0FmBzgJa2c/%3Fsize%3D512/https/cdn.discordapp.com/icons/1441821616186196191/8db10a79e33d3388a413c6d3989385e8.png?format=webp&quality=lossless&width=160&height=160"
                      alt="Avatar"
                      width={44}
                      height={44}
                      className="rounded-2xl"
                    />
                    <div>
                      <h3 className="font-bold text-base">{group?.name || "Moderation Training"}</h3>
                      <p className="text-blue-400 text-xs">Hosted by {members.find(m => m.uid === group?.owner)?.name || "Staff"}</p>
                    </div>
                    <div className="ml-auto flex -space-x-2">
                      {members.slice(0, 4).map(member => (
                        <div key={member.uid} className="w-6 h-6 rounded-full border-2 border-[#1a1a2e] bg-gray-600 overflow-hidden relative">
                          {member.avatar ? (
                            <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-400 flex items-center justify-center text-[8px] font-bold">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col min-h-0 bg-transparent custom-cometchat overflow-hidden">
                    {group ? (
                      <>
                        <div
                          ref={scrollRef}
                          className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide chat-scroll-container"
                        >
                          <CometChatMessageList
                            group={group}
                            scrollToBottomOnNewMessages={true}
                          />
                        </div>
                        <div className="p-6 border-t border-white/10 shrink-0">
                          <div className="bg-white/5 rounded-2xl border border-white/10 p-1">
                            <CometChatMessageComposer group={group} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-gray-400 text-sm font-medium">Entering classroom...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Who's Here Sidebar */}
                <div className="w-full lg:w-72 bg-black/20 flex flex-col min-h-0">
                  <div className="p-6 border-b border-white/10 shrink-0">
                    <h3 className="font-bold text-sm">Who's Here</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {members.length > 0 ? (
                      members.sort((a, b) => {
                        // Put host at the top
                        if (a.uid === group?.owner) return -1;
                        if (b.uid === group?.owner) return 1;
                        return 0;
                      }).map((member) => (
                        <ParticipantItem
                          key={member.uid}
                          name={member.name}
                          avatar={member.avatar}
                          role={member.uid === group?.owner ? "HOST" : (member.scope !== "participant" ? "MOD" : undefined)}
                          isHost={member.uid === group?.owner}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-xs italic">
                        No participants found
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-white/10 text-center shrink-0">
                    <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold">Staff Portal built with Aloha</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="py-4 text-center shrink-0">
            <p className="text-gray-600 text-[10px]">© 2024 Honolulu State Roleplay ~ Staff Portal built with Aloha</p>
          </footer>
        </div>
      </main>

      <style jsx global>{`
        .custom-cometchat .comet-chat-message-list {
          background: transparent !important;
        }

                /* Fix for vertical text/narrow bubbles - Ultra Aggressive */
                .custom-cometchat [class*="message-bubble"] {
                    max-width: 85% !important;
                    min-width: 80px !important;
                    width: auto !important;
                    display: inline-block !important;
                    word-wrap: break-word !important;
                    white-space: normal !important;
                    height: auto !important;
                }

                .custom-cometchat [class*="message-bubble"] [class*="text"] {
                    display: block !important;
                    width: auto !important;
                    word-break: break-word !important;
                    white-space: pre-wrap !important;
                    line-height: 1.4 !important;
                }

                .custom-cometchat [class*="message-bubble"] * {
                    white-space: normal !important;
                    overflow-wrap: break-word !important;
                }

                /* Dark mode for incoming bubbles */
                .custom-cometchat [class*="message-bubble--incoming"] {
                    background: rgba(0, 0, 0, 0.6) !important;
                    backdrop-filter: blur(8px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                }

                .custom-cometchat [class*="message-bubble--incoming"] [class*="text"] {
                    color: white !important;
                }

        /* Ensure parent containers don't restrict width */
        .custom-cometchat div[class*="comet-chat-message-list__message-item"] {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
        }

        .custom-cometchat .comet-chat-message-composer {
          background: transparent !important;
          border: none !important;
        }
        .custom-cometchat .comet-chat-message-composer__input {
          color: white !important;
        }
        .custom-cometchat .comet-chat-message-composer__send-button {
          background: #2563eb !important;
          border-radius: 12px !important;
          padding: 8px 16px !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Auto-scroll helper */
        .chat-scroll-container > div {
            display: flex;
            flex-direction: column;
        }
      `}</style>
    </div>
  );
}

function ParticipantItem({ name, avatar, role, isHost, holds }: { name: string; avatar?: string; role?: string; isHost?: boolean; holds?: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 ${isHost ? 'bg-white/5 border border-white/10' : ''}`}>
      <div className="relative">
        <div className="w-8 h-8 rounded-lg bg-gray-700 overflow-hidden relative">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-bold text-white truncate">{name}</p>
          {role && (
            <span className={`text-[8px] font-black px-1 rounded-sm ${isHost ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
              {role}
            </span>
          )}
        </div>
        {holds && <p className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter opacity-70">(HOLD)</p>}
      </div>
    </div>

  );
}
