import { getAuthenticatedUser } from "../lib/auth";
import Sidebar from "../components/Sidebar";
import DashboardAnnouncements from "../components/DashboardAnnouncements";
import Link from "next/link";

export default async function Dashboard() {
  const user = await getAuthenticatedUser("/dashboard");

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar user={user} />
      <main className="flex-1 lg:ml-72 relative overflow-hidden pt-16 lg:pt-0">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.discordapp.com/attachments/1458015184143777802/1458015376259551344/image.png?ex=695e1a22&is=695cc8a2&hm=05888c0918d647b70cb54006fb2cf34ffe9f010ad1e43458860ba27e4576cb08')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
        
        {/* Content */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Aloha, {user.username} 🌺</h1>
          <p className="text-gray-300 mb-6 sm:mb-8">
            Mahalo for keeping HSRP running smoothly
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* On-Duty Staff */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-500/80 to-blue-700/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👮</span>
                <span className="text-white/90 font-medium">On-Duty Staff</span>
              </div>
              <p className="text-4xl font-bold text-white">--</p>
            </div>

            {/* Server Status */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-teal-500/80 to-teal-700/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🖥️</span>
                <span className="text-white/90 font-medium">Server Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <p className="text-2xl font-bold text-white">Online</p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Announcements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Quick Actions - Navigation Items */}
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard" className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600/30 to-blue-800/30 rounded-xl hover:from-blue-600/50 hover:to-blue-800/50 transition-all border border-blue-500/20">
                  <span className="text-xl">📊</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Dashboard</p>
                  </div>
                </Link>
                <Link href="/loa" className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-600/30 to-orange-800/30 rounded-xl hover:from-orange-600/50 hover:to-orange-800/50 transition-all border border-orange-500/20">
                  <span className="text-xl">📅</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">LOA</p>
                  </div>
                </Link>
                <Link href="/server-management" className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-600/30 to-teal-800/30 rounded-xl hover:from-teal-600/50 hover:to-teal-800/50 transition-all border border-teal-500/20">
                  <span className="text-xl">⚙️</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Server Management</p>
                  </div>
                </Link>
                <Link href="/staff-handbook" className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600/30 to-purple-800/30 rounded-xl hover:from-purple-600/50 hover:to-purple-800/50 transition-all border border-purple-500/20">
                  <span className="text-xl">📖</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Staff Handbook</p>
                  </div>
                </Link>
                <Link href="/staff-training" className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-600/30 to-green-800/30 rounded-xl hover:from-green-600/50 hover:to-green-800/50 transition-all border border-green-500/20 col-span-2">
                  <span className="text-xl">📝</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Staff Training</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Announcements */}
            <DashboardAnnouncements />
          </div>
        </div>
      </main>
    </div>
  );
}
