'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileText,
  Pill,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Settings,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ScanLine,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { Role } from '@/types/api';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  nameKey: string;
  defaultName: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isAi?: boolean;
  allowedRoles?: Role[];
}

interface NavGroup {
  groupKey: string;
  defaultGroup: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, logout, hasRole } = useAuthStore();

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

  const navGroups: NavGroup[] = [
    {
      groupKey: 'OVERVIEW',
      defaultGroup: 'TỔNG QUAN',
      items: [
        { nameKey: 'dashboard', defaultName: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      groupKey: 'CLINIC',
      defaultGroup: 'DỊCH VỤ & KHÁM',
      items: [
        {
          nameKey: 'appointments',
          defaultName: 'Lịch khám',
          href: '/appointments',
          icon: Calendar,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT'],
        },
        {
          nameKey: 'doctors',
          defaultName: 'Bác sĩ & Chuyên gia',
          href: '/doctors',
          icon: UserCheck,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT'],
        },
        {
          nameKey: 'patients',
          defaultName: 'Bệnh nhân',
          href: '/patients',
          icon: Users,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF'],
        },
        {
          nameKey: 'medicalRecords',
          defaultName: 'Hồ sơ bệnh án',
          href: '/medical-records',
          icon: FileText,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT'],
        },
        {
          nameKey: 'chat',
          defaultName: 'Tin nhắn trực tuyến',
          href: '/chat',
          icon: MessageSquare,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT'],
        },
        {
          nameKey: 'prescriptions',
          defaultName: 'Đơn thuốc',
          href: '/prescriptions',
          icon: Pill,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF'],
        },
      ],
    },
    {
      groupKey: 'AI SUITE',
      defaultGroup: 'TRỢ LÝ AI',
      items: [
        {
          nameKey: 'aiAssistant',
          defaultName: 'NexAI Y Tế',
          href: '/ai',
          icon: Sparkles,
          isAi: true,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT'],
        },
      ],
    },
    {
      groupKey: 'FINANCE_INVENTORY',
      defaultGroup: 'KHO & TÀI CHÍNH',
      items: [
        {
          nameKey: 'products',
          defaultName: 'Kho thuốc & Vật tư',
          href: '/products',
          icon: Activity,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF'],
        },
        {
          nameKey: 'payments',
          defaultName: 'Thanh toán & Hóa đơn',
          href: '/payments',
          icon: CreditCard,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_PATIENT'],
        },
      ],
    },
    {
      groupKey: 'ADMIN',
      defaultGroup: 'HỆ THỐNG',
      items: [
        {
          nameKey: 'users',
          defaultName: 'Quản lý tài khoản',
          href: '/users',
          icon: ShieldCheck,
          allowedRoles: ['ROLE_ADMIN'],
        },
        {
          nameKey: 'settings',
          defaultName: 'Cài đặt hệ thống',
          href: '/settings',
          icon: Settings,
          allowedRoles: ['ROLE_ADMIN'],
        },
      ],
    },
  ];

  const displayName = user?.name || user?.username || 'User';
  const roleDisplay = user?.role ? user.role.replace('ROLE_', '') : 'PATIENT';

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-slate-100 transition-all duration-300 flex flex-col justify-between shadow-[2px_0_12px_rgba(0,0,0,0.02)] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100/80">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-500/20 shrink-0">
              ✦
            </div>
            {!collapsed && (
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                  NexClinic
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 font-extrabold text-[10px] tracking-wide">
                  AI
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navGroups.map((group, idx) => {
            const filteredItems = group.items.filter((item) =>
              item.allowedRoles ? hasRole(item.allowedRoles) : true
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={idx}>
                {!collapsed && (
                  <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {group.defaultGroup}
                  </p>
                )}
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const isActive = pathname === item.href || (pathname?.startsWith(item.href + '/') && item.href !== '/');
                    const Icon = item.icon;
                    const label = t(item.nameKey) || item.defaultName;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-purple-50 text-purple-700 font-bold shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        } ${collapsed ? 'justify-center px-0' : ''}`}
                        title={collapsed ? label : undefined}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-purple-600'
                              : item.isAi
                              ? 'text-purple-500'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        {!collapsed && <span>{label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Profile & Logout at Bottom */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-purple-600 font-bold tracking-wide uppercase">
                  {roleDisplay}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2.5 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
