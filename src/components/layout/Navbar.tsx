'use client';

/**
-- ==============================================================================
-- BOUTIQUE-INDUSTRIAL TOP NAVBAR (UI LAYER)
-- Serial Position Effect: Catalogue first, Auth/Dashboard last, Notification Bell
-- ==============================================================================
*/

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Printer, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { NotificationsPanel } from '../dashboard/NotificationsPanel';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, unreadNotificationsCount, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = async () => {
    await logout();
    router.push('/auth');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-[#18181B] text-white flex items-center justify-center font-mono font-bold text-sm tracking-wider">
            <Printer className="w-4 h-4 text-[#EA580C]" />
          </div>
          <span className="font-bold tracking-tight text-zinc-900 text-lg">
            PRINT<span className="text-[#EA580C]">PLATFORM</span>
          </span>
        </Link>

        {/* Center / Left Navigation: Catalogue First */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-[#EA580C] font-semibold' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Product Catalogue
          </Link>
          <a
            href="/#gallery"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Live Work Gallery
          </a>
        </nav>

        {/* Right Navigation: Dashboard / Admin / Auth Last */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Notifications Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-md hover:bg-zinc-100 text-zinc-700 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#EA580C] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-zinc-200 rounded-lg shadow-xl z-50 p-2">
                    <NotificationsPanel onClose={() => setShowNotifications(false)} />
                  </div>
                )}
              </div>

              {/* Admin Link if role === 'admin' */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-colors ${
                    pathname.startsWith('/admin')
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Customer Dashboard Link */}
              <Link
                href="/dashboard"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                  pathname.startsWith('/dashboard')
                    ? 'bg-[#EA580C] text-white'
                    : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center justify-center h-9 px-4 text-xs font-semibold rounded-md bg-[#18181B] text-white hover:bg-zinc-800 transition-colors shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

