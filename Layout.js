import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Menu, X, LogOut, Home, Dumbbell, Apple, TrendingUp, MessageCircle, Settings } from 'lucide-react';
import { createPageUrl } from '@/utils';

const PAGES = [
  { name: 'Dashboard', path: 'Dashboard', icon: Home },
  { name: 'Workouts', path: 'Workouts', icon: Dumbbell },
  { name: 'Nutrition', path: 'Nutrition', icon: Apple },
  { name: 'Progress', path: 'Progress', icon: TrendingUp },
  { name: 'Chat', path: 'Chat', icon: MessageCircle },
  { name: 'Profile', path: 'Profile', icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (err) {
        console.log('Not authenticated');
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#F5F7FA]" style={{ '--primary': '#2E86AB', '--secondary': '#A23B72', '--success': '#4CAF50', '--warning': '#FF9800' }}>
      <style>{`
        :root {
          --primary: #2E86AB;
          --secondary: #A23B72;
          --background: #F5F7FA;
          --text: #333333;
          --success: #4CAF50;
          --warning: #FF9800;
        }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold" style={{ color: '#2E86AB' }}>
            FitFlow
          </h1>
        </div>

        <nav className="space-y-2 px-4">
          {PAGES.map((page) => {
            const Icon = page.icon;
            const isActive = currentPageName === page.name;
            return (
              <Link
                key={page.path}
                to={createPageUrl(page.path)}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#2E86AB] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{page.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="font-semibold text-gray-900">{user?.full_name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            {user?.profile_picture_url && (
              <img
                src={user.profile_picture_url}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2"
                style={{ borderColor: '#2E86AB' }}
              />
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}