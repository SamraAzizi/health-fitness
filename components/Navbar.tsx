'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Dumbbell, Home, Utensils, TrendingUp, User, MessageCircle, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Workout', icon: Dumbbell, path: '/workout' },
    { label: 'Nutrition', icon: Utensils, path: '/nutrition' },
    { label: 'Progress', icon: TrendingUp, path: '/progress' },
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Chat', icon: MessageCircle, path: '/chat' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Dumbbell size={28} className="text-[#2E86AB]" />
            <span className="text-xl font-bold text-gray-900">Health Tracker</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#2E86AB] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <LogOut size={18} />
            <span className="hidden md:inline text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2E86AB] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
