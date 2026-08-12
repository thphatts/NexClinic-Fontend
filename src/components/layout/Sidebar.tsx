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
      defaultGroup: 'OVERVIEW',
      items: [
        { nameKey: 'dashboard', defaultName: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      groupKey: 'CLINIC',
      defaultGroup: 'CLINIC',
      items: [
        {
          nameKey: 'patients',
          defaultName: 'Patients',
          href: '/patients',
          icon: Users,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF'],
        },
        {
          nameKey: 'doctors',
          defaultName: 'Doctors',
          href: '/doctors',
          icon: UserCheck,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT'],
        },
        {
          nameKey: 'appointments',
          defaultName: 'Appointments',
          href: '/appointments',
          icon: Calendar,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF', 'ROLE_PATIENT'],
        },
        {
          nameKey: 'medicalRecords',
          defaultName: 'Medical Records',
          href: '/medical-records',
          icon: FileText,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_PATIENT'],
        },
        {
          nameKey: 'prescriptions',
          defaultName: 'Prescriptions',
          href: '/prescriptions',
          icon: Pill,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF'],
        },
      ],
    },
    {
      groupKey: 'INVENTORY',
      defaultGroup: 'INVENTORY',
      items: [
        {
          nameKey: 'products',
          defaultName: 'Products & Drugs',
          href: '/products',
          icon: Activity,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_STAFF'],
        },
      ],
    },
    {
      groupKey: 'FINANCE',
      defaultGroup: 'FINANCE',
      items: [
        {
          nameKey: 'payments',
          defaultName: 'Payments',
          href: '/payments',
          icon: CreditCard,
          allowedRoles: ['ROLE_ADMIN', 'ROLE_STAFF', 'ROLE_PATIENT'],
        },
      ],
    },
    {
      groupKey: 'AI SUITE',
      defaultGroup: 'AI SUITE',
      items: [
        { nameKey: 'aiAssistant', defaultName: 'NexAI Assistant', href: '/ai', icon: Sparkles, isAi: true },
      ],
    },
    {
      groupKey: 'ADMIN',
      defaultGroup: 'ADMIN',
      items: [
        {
          nameKey: 'users',
          defaultName: 'Users & Roles',
          href: '/users',
          icon: ShieldCheck,
          allowedRoles: ['ROLE_ADMIN'],
        },
        {
          nameKey: 'settings',
          defaultName: 'System Settings',
          href: '/settings',
          icon: Settings,
          allowedRoles: ['ROLE_ADMIN'],
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-slate-200/80 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-extrabold shadow-md shrink-0">
              ✦
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 leading-tight tracking-tight">
                  NexClinic
                </span>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">
                  AI Pro
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navGroups.map((group, idx) => {
            const filteredItems = group.items.filter((item) =>
              item.allowedRoles ? hasRole(item.allowedRoles) : true
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={idx}>
                {!collapsed && (
                  <p className="px-3 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {group.defaultGroup}
                  </p>
                )}
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    const Icon = item.icon;
                    const label = t(item.nameKey) || item.defaultName;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? item.isAi
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                              : 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        } ${collapsed ? 'justify-center px-0' : ''}`}
                        title={collapsed ? label : undefined}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : item.isAi ? 'text-purple-600' : 'text-slate-500'
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

      {/* Logout Action */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? t('logout') : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
};

