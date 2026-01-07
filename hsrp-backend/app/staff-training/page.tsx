"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";
import {
  getTrainingSessions,
  updateTrainingSession,
  createTrainingSession,
  type TrainingSession,
  type ChatMessage,
} from "../lib/storage";

interface User {
  id: string;
  username: string;
  avatar: string | null;
  adminLevel?: number;
}

function StaffTrainingContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [view, setView] = useState<"lobby" | "chat">("lobby");
  const [isUpdating, setIsUpdating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isTrainer = (user?.adminLevel ?? 0) >= 4; // Internal Affairs and above can be trainers

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

    const loadSessions = async () => {
      const loadedSessions = await getTrainingSessions();
      setSessions(loadedSessions);

      // Check if we have a sessionId in URL params (from training claims)
      const sessionId = searchParams.get("sessionId");
      if (sessionId) {
        const session = loadedSessions.find(s => s.id === sessionId);
        if (session) {
          setActiveSession(session);
          setView("chat");
        }
      }
    };
    loadSessions();
  }, [searchParams]);

  useEffect(() => {
    // Auto-scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  const [isSending, setIsSending] = useState(false);

  // Poll for updates every 2 seconds when in chat (skip if currently updating or sending)
  useEffect(() => {
    if (view === "chat" && activeSession && !isUpdating) {
      const interval = setInterval(async () => {
        if (isUpdating || isSending) return; // Pause polling during update/send
        const updatedSessions = await getTrainingSessions();
        const updatedSession = updatedSessions.find(s => s.id === activeSession.id);
        if (updatedSession) {
          setActiveSession(updatedSession);
        }
        setSessions(updatedSessions);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [view, activeSession?.id, isUpdating, isSending]);

  const requestTraining = async () => {
    if (!user) return;

    const newSession: TrainingSession = {
      id: Date.now().toString(),
      traineeId: user.id,
      traineeName: user.username,
      trainerId: null,
      trainerName: null,
      status: "waiting",
      messages: [{
        id: Date.now().toString(),
        sender: "System",
        senderType: "system",
        message: `${user.username} has requested moderation training. Waiting for a trainer...`,
        timestamp: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
    };

    await createTrainingSession(newSession);
    const updated = await getTrainingSessions();
    setSessions(updated);
    setActiveSession(newSession);
    setView("chat");
  };

  const claimSession = async (session: TrainingSession) => {
    if (!user || !isTrainer) return;

    const updatedSession: TrainingSession = {
      ...session,
      trainerId: user.id,
      trainerName: user.username,
      status: "active",
      messages: [
        ...session.messages,
        {
          id: Date.now().toString(),
          sender: "System",
          senderType: "system",
          message: `${user.username} has joined as the trainer. Training session has started!`,
          timestamp: new Date().toISOString(),
        }
      ],
    };

    await updateTrainingSession(updatedSession);
    const updatedSessions = await getTrainingSessions();
    setSessions(updatedSessions);
    setActiveSession(updatedSession);
    setView("chat");
  };

  const joinSession = (session: TrainingSession) => {
    setActiveSession(session);
    setView("chat");
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !activeSession || !user || isSending) return;
    setIsSending(true);

    const newMessage: ChatMessage = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      sender: user.username,
      senderType: user.id === activeSession.traineeId ? "trainee" : "trainer",
      message: messageInput.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedSession = {
      ...activeSession,
      messages: [...activeSession.messages, newMessage],
    };

    // Optimistic UI update
    setActiveSession(updatedSession);

    try {
      await updateTrainingSession(updatedSession);
      const updatedSessions = await getTrainingSessions();
      setSessions(updatedSessions);
      setActiveSession(updatedSession);
      setMessageInput("");
    } catch (error) {
      // Revert optimistic update and show error
      setActiveSession(activeSession);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const completeSession = async () => {
    if (!activeSession || !user || isUpdating) return;

    setIsUpdating(true);
    
    const updatedSession: TrainingSession = {
      ...activeSession,
      status: "completed",
      messages: [
        ...activeSession.messages,
        {
          id: Date.now().toString(),
          sender: "System",
          senderType: "system",
          message: `Training session has been completed by ${user.username}.`,
          timestamp: new Date().toISOString(),
        }
      ],
    };

    // Update local state immediately (optimistic update)
    setActiveSession(updatedSession);
    
    try {
      await updateTrainingSession(updatedSession);
      // Wait a moment for DB to sync, then fetch fresh data
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedSessions = await getTrainingSessions();
      setSessions(updatedSessions);
    } finally {
      setIsUpdating(false);
    }
  };

  const leaveSession = async () => {
    setActiveSession(null);
    setView("lobby");
    const updatedSessions = await getTrainingSessions();
    setSessions(updatedSessions);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const waitingSessions = sessions.filter(s => s.status === "waiting");
  const myActiveSessions = sessions.filter(s => 
    s.status === "active" && (s.traineeId === user.id || s.trainerId === user.id)
  );
  const myWaitingSession = sessions.find(s => s.status === "waiting" && s.traineeId === user.id);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <Sidebar user={user} />

      <main className="flex-1 lg:ml-72 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        {view === "lobby" ? (
          <>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Staff Training 📝</h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                {isTrainer ? "Claim training sessions or manage active trainings" : "Request moderation training from a trainer"}
              </p>
            </div>

            {/* Request Training Button (for trainees) */}
            {!isTrainer && !myWaitingSession && (
              <button
                onClick={requestTraining}
                className="mb-6 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all text-white font-medium"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Request Moderation Training
              </button>
            )}

            {/* My Waiting Session */}
            {myWaitingSession && (
              <div className="mb-6 bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-yellow-400 font-semibold">Your Training Request</h3>
                    <p className="text-gray-400 text-sm mt-1">Waiting for a trainer to claim your session...</p>
                  </div>
                  <button
                    onClick={() => joinSession(myWaitingSession)}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors"
                  >
                    View Session
                  </button>
                </div>
              </div>
            )}

            {/* My Active Sessions */}
            {myActiveSessions.length > 0 && (
              <div className="mb-6">
                <h2 className="text-white font-semibold text-lg mb-4">Your Active Sessions</h2>
                <div className="space-y-3">
                  {myActiveSessions.map(session => (
                    <div key={session.id} className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">
                          {session.traineeId === user.id ? `Trainer: ${session.trainerName}` : `Trainee: ${session.traineeName}`}
                        </p>
                        <p className="text-gray-400 text-sm">Session in progress</p>
                      </div>
                      <button
                        onClick={() => joinSession(session)}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                      >
                        Continue Chat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Waiting Sessions (for trainers) */}
            {isTrainer && waitingSessions.length > 0 && (
              <div className="mb-6">
                <h2 className="text-white font-semibold text-lg mb-4">Waiting for Trainer ({waitingSessions.length})</h2>
                <div className="space-y-3">
                  {waitingSessions.map(session => (
                    <div key={session.id} className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{session.traineeName}</p>
                        <p className="text-gray-400 text-sm">Requested {new Date(session.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <button
                        onClick={() => claimSession(session)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Claim Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!myWaitingSession && myActiveSessions.length === 0 && (isTrainer ? waitingSessions.length === 0 : true) && (
              <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl p-12 border border-white/5 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {isTrainer ? "No Pending Training Requests" : "No Active Training"}
                </h3>
                <p className="text-gray-400">
                  {isTrainer ? "Check back later for new training requests" : "Click the button above to request training"}
                </p>
              </div>
            )}
          </>
        ) : (
          /* Chat View */
          <div className="h-[calc(100vh-4rem)] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={leaveSession}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl font-bold text-white">Training Session</h1>
                  <p className="text-gray-400 text-sm">
                    {activeSession?.status === "waiting" 
                      ? "Waiting for trainer..." 
                      : activeSession?.status === "completed"
                      ? "Session completed"
                      : `${activeSession?.traineeName} ↔ ${activeSession?.trainerName}`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs ${
                  activeSession?.status === "waiting" ? "bg-yellow-500/20 text-yellow-400" :
                  activeSession?.status === "completed" ? "bg-gray-500/20 text-gray-400" :
                  "bg-green-500/20 text-green-400"
                }`}>
                  {activeSession?.status === "waiting" ? "Waiting" : 
                   activeSession?.status === "completed" ? "Completed" : "Active"}
                </span>
                {isTrainer && activeSession?.status === "active" && (
                  <button
                    onClick={completeSession}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Completing..." : "Complete Training"}
                  </button>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 bg-[#1a1a2e]/50 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeSession?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderType === "system" ? "justify-center" :
                      msg.sender === user.username ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.senderType === "system" ? (
                      <div className="bg-white/5 text-gray-400 text-sm px-4 py-2 rounded-lg max-w-md text-center">
                        {msg.message}
                      </div>
                    ) : (
                      <div className={`max-w-md ${msg.sender === user.username ? "items-end" : "items-start"}`}>
                        <p className={`text-xs mb-1 ${
                          msg.senderType === "trainer" ? "text-blue-400" : "text-green-400"
                        }`}>
                          {msg.sender} ({msg.senderType === "trainer" ? "Trainer" : "Trainee"})
                        </p>
                        <div className={`px-4 py-2 rounded-2xl ${
                          msg.sender === user.username
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-[#2a2a3e] text-white rounded-bl-sm"
                        }`}>
                          {msg.message}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              {activeSession?.status !== "completed" && (activeSession?.status === "active" || activeSession?.traineeId === user.id) && (
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={activeSession?.status === "waiting" ? "Waiting for trainer..." : "Type a message..."}
                      disabled={isSending || (activeSession?.status === "waiting" && activeSession?.traineeId === user.id)}
                      className="flex-1 bg-[#0a0a0f]/50 text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isSending || !messageInput.trim() || activeSession?.status === "waiting"}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function StaffTraining() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <StaffTrainingContent />
    </Suspense>
  );
}
