'use client';

/**
-- ==============================================================================
-- SKELETON LOADER COMPONENT (UI LAYER)
-- ==============================================================================
*/

import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-zinc-200 rounded-md ${className}`} />;
};

