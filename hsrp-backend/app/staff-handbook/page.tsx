import { getAuthenticatedUser } from "../lib/auth";
import Sidebar from "../components/Sidebar";

export default async function StaffHandbook() {
  const user = await getAuthenticatedUser("/staff-handbook");

  // Google Doc URL - use the regular view URL (not embed)
  const googleDocUrl = "https://docs.google.com/document/d/1nUHUWfbvCmvV_ToqjJ5V8UbDu0MqUdOnYJvU0ESE2uQ/preview";

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar user={user} />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Staff Handbook</h1>
            <p className="text-gray-400 mt-1">Official guidelines and procedures for HSRP staff members</p>
          </div>
          <a
            href="https://docs.google.com/document/d/1nUHUWfbvCmvV_ToqjJ5V8UbDu0MqUdOnYJvU0ESE2uQ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#2a2a2c] hover:bg-[#3a3a3c] text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in Google Docs
          </a>
        </div>

        <div className="bg-white rounded-lg overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
          <iframe
            src={googleDocUrl}
            className="w-full h-full border-0"
            title="Staff Handbook"
            allowFullScreen
          />
        </div>
      </main>
    </div>
  );
}
