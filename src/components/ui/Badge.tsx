import React from 'react';

type BadgeVariant =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'SUCCESS'
  | 'FAILED'
  | 'ROLE_ADMIN'
  | 'ROLE_DOCTOR'
  | 'ROLE_STAFF'
  | 'ROLE_PATIENT'
  | 'INFO';

interface BadgeProps {
  variant: BadgeVariant | string;
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, label, className = '' }) => {
  const getBadgeStyle = (v: string) => {
    switch (v) {
      case 'CONFIRMED':
      case 'COMPLETED':
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ROLE_ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ROLE_DOCTOR':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ROLE_STAFF':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'ROLE_PATIENT':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle(
        variant
      )} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {label || variant}
    </span>
  );
};
