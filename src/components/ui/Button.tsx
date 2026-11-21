'use client';

/**
-- ==============================================================================
-- BOUTIQUE-INDUSTRIAL BUTTON COMPONENT (UI LAYER)
-- ==============================================================================
*/

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-md';

  const sizeStyles = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-11 px-5 text-sm',
    lg: 'h-13 px-7 text-base font-semibold',
  };

  const variantStyles = {
    // Primary reserved for #EA580C (Von Restorff Effect)
    primary:
      'bg-[#EA580C] hover:bg-[#D94F04] text-white shadow-sm focus:ring-[#EA580C] border border-[#EA580C]',
    secondary:
      'bg-[#18181B] hover:bg-[#27272A] text-white shadow-sm focus:ring-[#18181B] border border-[#18181B]',
    outline:
      'bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 focus:ring-zinc-400 shadow-xs',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-red-600',
    ghost:
      'bg-transparent hover:bg-zinc-100 text-zinc-700 focus:ring-zinc-400',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

