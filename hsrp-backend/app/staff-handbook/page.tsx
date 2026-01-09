import { getAuthenticatedUser } from "../lib/auth";
import Sidebar from "../components/Sidebar";

export default async function StaffHandbook() {
  const user = await getAuthenticatedUser("/staff-handbook");

  // Google Doc URL - use the regular view URL (not embed)
  const googleDocUrl = "https://docs.google.com/document/d/1nUHUWfbvCmvV_ToqjJ5V8UbDu0MqUdOnYJvU0ESE2uQ/preview";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex overflow-hidden">
      <Sidebar user={user} />

      <main className="flex-1 lg:ml-72 relative overflow-hidden pt-16 lg:pt-0">
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
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Staff Handbook 📖</h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Official guidelines and procedures for HSRP staff members</p>
            </div>
            <a
              href="https://docs.google.com/document/d/1nUHUWfbvCmvV_ToqjJ5V8UbDu0MqUdOnYJvU0ESE2uQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1a1a2e]/80 backdrop-blur-sm hover:bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 shadow-lg transition-all text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in Google Docs
            </a>
          </div>

          <div className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/5" style={{ height: "calc(100vh - 180px)" }}>
            <iframe
              src={googleDocUrl}
              className="w-full h-full border-0"
              title="Staff Handbook"
              allowFullScreen
            />
          </div>
        </div>
      </main>
    </div>
  );
}
