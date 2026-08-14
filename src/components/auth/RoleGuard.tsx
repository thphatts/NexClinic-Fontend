'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types/api';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback = null }) => {
  const { user, hasRole } = useAuthStore();

  if (!user || !hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
