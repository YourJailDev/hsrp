"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

interface User {
  id: string;
  username: string;
  avatar: string | null;
}

export default function StaffHandbook() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((c) => c.trim().startsWith("discord_user="));

    if (userCookie) {
      try {
        const userData = JSON.parse(
          decodeURIComponent(userCookie.split("=")[1])
        );
        setUser(userData);
      } catch {
        router.push("/");
      }
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Replace this with your actual Google Doc embed URL
  // To get the embed URL: Open Google Doc → File → Share → Publish to web → Embed
  const googleDocEmbedUrl = "https://docs.google.com/document/d/1nUHUWfbvCmvV_ToqjJ5V8UbDu0MqUdOnYJvU0ESE2uQ/pub?embedded=true";

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar user={user} />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Staff Handbook</h1>
          <p className="text-gray-400 mt-1">Official guidelines and procedures for HSRP staff members</p>
        </div>

        <div className="bg-[#1c1c1e] rounded-lg overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
          <iframe
            src={googleDocEmbedUrl}
            className="w-full h-full border-0"
            title="Staff Handbook"
            allowFullScreen
          />
        </div>
      </main>
    </div>
  );
}
