"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const userAdminLevel = user.adminLevel ?? AdminLevel.TRAINEE_MOD;

  // Filter nav items based on user's admin level
  const filteredNavItems = NAV_ITEMS.filter(item => userAdminLevel >= item.requiredLevel);

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    : null;

  const NavContent = () => (
    <>
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <Image
          src="https://images-ext-1.discordapp.net/external/zHtYuWHJ4jcw2EiyELgUy7WaF2oWpO8br0FmBzgJa2c/%3Fsize%3D512/https/cdn.discordapp.com/icons/1441821616186196191/8db10a79e33d3388a413c6d3989385e8.png?format=webp&quality=lossless&width=160&height=160"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-xl"
        />
        <div>
          <h1 className="text-white text-sm">
            <span className="font-bold">HSRP</span>{" "}
            <span className="font-normal text-gray-400">Connect</span>
          </h1>
          <p className="text-gray-500 text-xs">Version 1</p>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="ml-auto text-gray-500 hover:text-white transition-colors lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Notification bell for desktop */}
        <button className="ml-auto text-gray-400 hover:text-white transition-colors hidden lg:block">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      <div className="px-4 mt-2">
        <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider mb-4 leading-relaxed">Honolulu State Roleplay —<br />Staff Operations Portal</p>
      </div>

      {/* Navigation */}
      <div className="px-3 mt-2 flex-1">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-3 px-2">Navigation</p>
        <nav className="flex flex-col gap-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.icon}
                href={item.href}
                className="block"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-[#1e1e30]'}`}>
                    {item.icon === "logging" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    )}
                    {item.icon === "dashboard" && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                      </svg>
                    )}
                    {item.icon === "training" && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    )}
                    {item.icon === "host" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    {item.icon === "loa" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    {item.icon === "settings" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {item.icon === "handbook" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                    {item.icon === "announcements" && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      {user && (
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={user.username}
                width={36}
                height={36}
                className="rounded-lg"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{user.username}</p>
              <p className="text-gray-500 text-xs truncate">Log Out</p>
            </div>
            <a href="/api/auth/logout" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0d0d15] border-b border-[#1a1a2e] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="https://images-ext-1.discordapp.net/external/zHtYuWHJ4jcw2EiyELgUy7WaF2oWpO8br0FmBzgJa2c/%3Fsize%3D512/https/cdn.discordapp.com/icons/1441821616186196191/8db10a79e33d3388a413c6d3989385e8.png?format=webp&quality=lossless&width=160&height=160"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <h1 className="text-white font-bold text-sm">HSRP Connect</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#1a1a2e] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0d0d15] border-r border-[#1a1a2e] transform transition-transform duration-300 ease-in-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <NavContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 min-h-screen flex-col shrink-0 fixed left-0 top-0 bg-[#0d0d15] border-r border-[#1a1a2e]">
        <NavContent />
      </div>
    </>
  );
}
