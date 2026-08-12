'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types/api';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback }) => {
  const { user, hasRole } = useAuthStore();

  if (!user || !hasRole(allowedRoles)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="p-8 max-w-lg mx-auto my-12 bg-white rounded-3xl border border-rose-100 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Access Restricted</h3>
          <p className="text-xs text-slate-500">
            Your current role (<span className="font-mono text-purple-600 font-semibold">{user?.role || 'Guest'}</span>) does not have permission to access this feature.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
