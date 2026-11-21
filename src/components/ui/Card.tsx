'use client';

/**
-- ==============================================================================
-- BOUTIQUE-INDUSTRIAL CARD COMPONENT (UI LAYER)
-- ==============================================================================
*/

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5 sm:p-6',
    lg: 'p-8',
  };

  const hoverClass = hoverEffect
    ? 'hover:border-zinc-300 hover:shadow-md transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white rounded-lg border border-[#E4E4E7] shadow-xs ${paddingStyles[padding]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

