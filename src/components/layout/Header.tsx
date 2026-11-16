'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { roleLabels } from '@/lib/navigation';
import { useState } from 'react';
import { AppointmentUpdates } from '@/components/appointments/AppointmentUpdates';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface HeaderProps { title?: string; onMobileMenuToggle?: () => void; mobileOpen?: boolean }

export function Header({ title, onMobileMenuToggle, mobileOpen }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const [leaving, setLeaving] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleLogout = async () => {
    setLeaving(true);
    try { await authService.logout(); } finally { queryClient.clear(); logout(); router.replace('/login'); }
  };
  return <header className="clinic-header">
    <div className="flex min-w-0 items-center gap-3">
      <button onClick={onMobileMenuToggle} aria-controls="portal-navigation" aria-expanded={mobileOpen} className="btn-secondary md:hidden">Menu</button>
      <span className="hidden text-xs text-slate-400 sm:inline">Không gian của bạn</span>
      <span className="hidden text-slate-300 sm:inline" aria-hidden="true">/</span>
      <span className="truncate text-xs font-medium text-slate-700">{title || 'NexClinic'}</span>
    </div>
    <div className="flex items-center gap-3 sm:gap-5">
      {user?.role === 'ROLE_PATIENT' && <button onClick={() => setUpdatesOpen(true)} className="text-xs text-teal-800">Cập nhật</button>}
      <Link href="/appointments" className="hidden text-xs text-slate-500 hover:text-teal-800 lg:inline">Xem lịch hẹn</Link>
      <div className="flex items-center gap-2.5">
        <div className="avatar-initial">{(user?.name || user?.username || 'N').charAt(0).toUpperCase()}</div>
        <div className="hidden sm:block"><p className="max-w-36 truncate text-xs font-semibold">{user?.name || user?.username || 'Tài khoản'}</p><p className="mt-1 text-[10px] text-slate-500">{user?.role && roleLabels[user.role]}</p></div>
      </div>
      <button disabled={leaving} onClick={() => void handleLogout().catch(() => {})} className="text-xs text-slate-500 hover:text-rose-700 disabled:opacity-50">{leaving ? 'Đang thoát…' : 'Đăng xuất'}</button>
    </div>
    {updatesOpen && <AppointmentUpdates onClose={() => setUpdatesOpen(false)} />}
  </header>;
}
