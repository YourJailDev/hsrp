import { getAuthenticatedUser } from "../lib/auth";
import Sidebar from "../components/Sidebar";

export default async function Dashboard() {
  const user = await getAuthenticatedUser("/dashboard");

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar user={user} />
      <main className="flex-1 ml-72 relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://cdn.discordapp.com/attachments/1458015184143777802/1458015376259551344/image.png?ex=695e1a22&is=695cc8a2&hm=05888c0918d647b70cb54006fb2cf34ffe9f010ad1e43458860ba27e4576cb08')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
        
        {/* Content */}
        <div className="relative z-10 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Aloha, {user.username} 🌺</h1>
          <p className="text-gray-300 mb-8">
            Mahalo for keeping HSRP running smoothly
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* On-Duty Staff */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-500/80 to-blue-700/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👮</span>
                <span className="text-white/90 font-medium">On-Duty Staff</span>
              </div>
              <p className="text-4xl font-bold text-white">--</p>
            </div>

            {/* Open Tickets */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-orange-500/80 to-orange-700/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📋</span>
                <span className="text-white/90 font-medium">Open Tickets</span>
              </div>
              <p className="text-4xl font-bold text-white">--</p>
            </div>

            {/* Pending Infractions */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-red-500/80 to-red-700/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⚠️</span>
                <span className="text-white/90 font-medium">Pending Infractions</span>
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
            {/* Quick Actions */}
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600/50 to-blue-800/50 rounded-xl hover:from-blue-600/70 hover:to-blue-800/70 transition-all">
                  <span className="text-xl">➕</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Open Staff Ticket</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-600/50 to-red-700/50 rounded-xl hover:from-orange-600/70 hover:to-red-700/70 transition-all">
                  <span className="text-xl">⚠️</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Submit Infraction</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-600/50 to-orange-600/50 rounded-xl hover:from-yellow-600/70 hover:to-orange-600/70 transition-all">
                  <span className="text-xl">📅</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Request LOA</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600/50 to-purple-800/50 rounded-xl hover:from-purple-600/70 hover:to-purple-800/70 transition-all">
                  <span className="text-xl">📚</span>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">View Trainings</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-lg">Recent Announcements 🌺</h2>
                <button className="text-sm text-gray-400 hover:text-white px-3 py-1 rounded-lg bg-[#2a2a3e]">Manage</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#2a2a3e]/50">
                  <span className="text-xl">📢</span>
                  <div>
                    <p className="text-white text-sm">No announcements yet</p>
                    <p className="text-gray-500 text-xs">Check back later</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Staff Schedule */}
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-lg">Staff Schedule</h2>
                <button className="text-sm text-white px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                  Claim Host ▾
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-400 text-sm mb-3">Upcoming Sessions</h3>
                  <div className="space-y-2">
                    <p className="text-gray-500 text-sm">No upcoming sessions</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-3">Recent Sessions</h3>
                  <div className="space-y-2">
                    <p className="text-gray-500 text-sm">No recent sessions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Training Progress */}
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-white font-semibold text-lg mb-4">Training Progress 🌴</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#2a2a3e]/50">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white text-sm">Moderation Training</span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">Completed</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#2a2a3e]/50">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400">📋</span>
                    <span className="text-white text-sm">Policy Test</span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs">Pending</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#2a2a3e]/50">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">🔒</span>
                    <span className="text-gray-400 text-sm">Supervisor Training</span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-gray-500/20 text-gray-400 text-xs">Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
