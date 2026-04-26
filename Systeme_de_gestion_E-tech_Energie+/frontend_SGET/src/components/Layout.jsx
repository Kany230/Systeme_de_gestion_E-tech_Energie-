import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronDown,
  Shield,
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Produits', href: '/products', icon: Package },
    { name: 'Documents', href: '/documents', icon: FileText },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Clean amber accent sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">E-tech</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Energie</p>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-5 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-amber-500 font-bold text-sm">
              {user?.nom?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.nom || 'Utilisateur'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || 'user@etech.com'}
              </p>
            </div>
          </div>
          {user?.role && (
            <div className="mt-3 flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 uppercase tracking-wider">
                <Shield className="w-3 h-3 mr-1" />
                {user.role}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Navigation
          </p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-150
                  ${active
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-700">
            <p className="px-3 mb-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              System
            </p>
            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-150"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Paramètres</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Déconnexion</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">System Status</span>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-500 font-medium">Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-sm">
          <div className="h-full flex items-center justify-between px-4 lg:px-8">
            {/* Left: Mobile menu + Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {navigation.find(n => isActiveRoute(n.href))?.name || 'Dashboard'}
                </h2>
              </div>
            </div>

            {/* Right: User menu */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-500 font-bold text-sm">
                  {user?.nom?.[0] || user?.email?.[0] || 'U'}
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{user?.nom || 'Utilisateur'}</p>
                    <p className="text-xs text-slate-500">{user?.email || 'user@etech.com'}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4 mr-3 text-slate-400" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-red-400" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
