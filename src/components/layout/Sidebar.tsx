'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, roleLabels } from '@/lib/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onCloseMobile, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, hasRole } = useAuthStore();
  const groups = [...new Set(navigation.map((item) => item.group))];
  return (
    <aside id="portal-navigation" aria-label="Điều hướng chính" className={`clinic-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-open' : ''}`}>
      <div className="flex h-24 shrink-0 items-center justify-between px-6">
        <Link href="/dashboard" onClick={onCloseMobile} aria-label="NexClinic — Tổng quan" className="brand-wordmark">nex<span className="sidebar-label">clinic</span><span className="text-teal-700">.</span></Link>
        <button onClick={onCloseMobile} className="md:hidden text-sm text-slate-500">Đóng</button>
      </div>
      <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-4">
        {groups.map((group) => {
          const items = navigation.filter((item) => item.group === group && (!item.roles || hasRole(item.roles)));
          if (!items.length) return null;
          return <div key={group}>
            <p className="sidebar-label mb-2 px-3 text-[10px] font-medium uppercase tracking-[.16em] text-slate-400">{group}</p>
            <div className="space-y-1">{items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return <Link key={item.href} href={item.href} onClick={onCloseMobile} aria-current={active ? 'page' : undefined} title={item.label} className={`nav-link ${active ? 'is-active' : ''}`}>
                <span className="sidebar-label">{item.label}</span><span className="sidebar-short" aria-hidden="true">{item.label.slice(0, 2)}</span>
                {active && <span className="nav-active-dot" aria-hidden="true" />}
              </Link>;
            })}</div>
          </div>;
        })}
      </nav>
      <div className="m-4 border-t border-slate-200/70 pt-4">
        <div className="sidebar-label rounded-2xl bg-[#edf2ef] p-4">
          <p className="text-xs font-medium text-teal-900">Chăm sóc từ những điều nhỏ.</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{user?.role ? roleLabels[user.role] : 'Không gian chăm sóc sức khỏe'}</p>
        </div>
        <button onClick={onToggleCollapse} aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'} className="mt-3 hidden w-full py-2 text-xs text-slate-500 hover:text-teal-800 md:block">{collapsed ? 'Mở rộng' : 'Thu gọn menu'}</button>
      </div>
    </aside>
  );
}
