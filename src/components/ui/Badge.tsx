'use client';

/**
-- ==============================================================================
-- STATUS BADGE COMPONENT (UI LAYER)
-- ==============================================================================
*/

import React from 'react';
import { PipelineStatus } from '../../types';

interface BadgeProps {
  status?: PipelineStatus | string;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'accent';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  className = '',
}) => {
  let computedVariant = variant || 'default';

  if (status) {
    switch (status) {
      case 'COMPLETED':
      case 'APPROVED':
      case 'PAID':
        computedVariant = 'success';
        break;
      case 'PRODUCTION':
      case 'PROOF':
        computedVariant = 'accent';
        break;
      case 'ARTWORK':
      case 'ORDER':
      case 'CHANGES_REQUESTED':
        computedVariant = 'warning';
        break;
      case 'QUOTE':
      case 'PENDING':
        computedVariant = 'info';
        break;
      case 'FAILED':
        computedVariant = 'danger';
        break;
    }
  }

  const styles = {
    default: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    accent: 'bg-orange-50 text-[#EA580C] border-orange-200 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${styles[computedVariant]} ${className}`}
    >
      {children || status}
    </span>
  );
};

