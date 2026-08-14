'use client';

import React from 'react';
import { Search, Bell, Calendar as CalendarIcon, Globe, LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';

interface HeaderProps {
  title?: string;
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      logout();
      window.location.href = '/login';
    }
  };

  const currentDate = new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const displayRole = user?.role ? user.role.replace('ROLE_', '') : 'GUEST';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100/90 sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Page Title or Search */}
      <div className="flex items-center gap-4">
        {title ? (
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h2>
        ) : (
          <div className="relative w-64 md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder') || 'Tìm kiếm nhanh...'}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>
        )}
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-3">
        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-100">
          <CalendarIcon className="w-3.5 h-3.5 text-purple-500" />
          <span>{currentDate}</span>
        </div>

        {/* Quick Language Switcher Button */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition text-xs font-bold border border-slate-100"
          title="Switch Language / Đổi Ngôn Ngữ"
        >
          <Globe className="w-3.5 h-3.5 text-purple-600" />
          <span>{language === 'en' ? 'EN' : 'VI'}</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-2xl text-slate-500 hover:text-purple-700 hover:bg-purple-50 border border-slate-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>

        <div className="w-px h-6 bg-slate-100 mx-1"></div>

        {/* User Profile Menu */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name?.charAt(0) || user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {user?.name || user?.username || 'User'}
            </span>
            <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wide">
              {displayRole}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition ml-1"
            title={t('logout') || 'Đăng xuất'}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
