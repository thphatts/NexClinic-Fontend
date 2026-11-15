'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NexAiFloatingWidget } from '../ai/NexAiFloatingWidget';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const section = navigation.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', close); };
  }, [mobileOpen]);

  return (
    <div className="app-shell min-h-screen text-slate-900 font-sans antialiased flex">
      <a href="#main-content" className="skip-link">Đến nội dung chính</a>
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {mobileOpen && (
        <button
          aria-label="Đóng menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[2px] md:hidden animate-in fade-in"
        />
      )}

      {/* Main Content Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'md:ml-24' : 'md:ml-64'
        }`}
      >
        {/* Header Bar */}
        <Header title={section?.label || title} mobileOpen={mobileOpen} onMobileMenuToggle={() => setMobileOpen((open) => !open)} />

        {/* Page Content */}
        <main id="main-content" className="clinic-content flex-1 p-4 pb-24 sm:p-6 sm:pb-24 lg:p-10 lg:pb-24 max-w-[1440px] w-full mx-auto">
          {pathname !== '/dashboard' && <div className="page-intro"><p className="eyebrow">NEXCLINIC / {section?.group || 'Chăm sóc'}</p><h1>{section?.label || title}</h1><p>{section?.description}</p></div>}
          <div key={pathname} className="page-enter">{children}</div>
        </main>
      </div>

      {/* Global Floating AI Assistant Widget */}
      <NexAiFloatingWidget />
    </div>
  );
};
