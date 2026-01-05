import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS, AdminLevel, getAdminLevelName } from "../config/roles";

interface SidebarProps {
  user: {  
    username: string;
    avatar: string | null;
    id: string;
    adminLevel?: number;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const userAdminLevel = user.adminLevel ?? AdminLevel.STAFF;
  
  // Filter nav items based on user's admin level
  const filteredNavItems = NAV_ITEMS.filter(item => userAdminLevel >= item.requiredLevel);

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : null;

  return (
    <div className="w-72 min-h-screen flex flex-col shrink-0" style={{ backgroundColor: '#1c1c1e' }}>
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <Image
          src="https://images-ext-1.discordapp.net/external/zHtYuWHJ4jcw2EiyELgUy7WaF2oWpO8br0FmBzgJa2c/%3Fsize%3D512/https/cdn.discordapp.com/icons/1441821616186196191/8db10a79e33d3388a413c6d3989385e8.png?format=webp&quality=lossless&width=160&height=160"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-white font-semibold text-sm">HSRP Connect</h1>
          <p className="text-gray-500 text-xs">Version 1</p>
        </div>
        <button className="ml-auto text-gray-500 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <div className="px-4 mt-4 flex-1">
        <p className="text-white text-xs font-medium uppercase tracking-wider mb-4">Navigation</p>
        <nav className="flex flex-col gap-3">
          {filteredNavItems.map((item) => (
            <Link key={item.icon} href={item.href} className="block">
              <div 
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white rounded-xl transition-all hover:scale-[1.02]"
                style={{ backgroundColor: '#2a2a2c' }}
              >
                {item.icon === "dashboard" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
                {item.icon === "loa" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {item.icon === "settings" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {item.icon === "handbook" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {item.icon === "training" && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Section */}
      {user && (
        <div className="px-4 mt-auto pb-4">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={user.username}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.username}</p>
              <p className="text-gray-500 text-xs truncate">{getAdminLevelName(userAdminLevel)}</p>
            </div>
            <a href="/api/auth/logout" className="text-gray-500 hover:text-red-400 transition-colors" title="Logout">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
