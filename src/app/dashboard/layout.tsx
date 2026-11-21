'use client';

/**
-- ==============================================================================
-- CUSTOMER DASHBOARD ROUTE GUARD LAYOUT
-- Blocks unauthenticated users; strictly isolates customer view.
-- ==============================================================================
*/

import React from 'react';
import { RoleGuard } from '../../components/layout/RoleGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard requiredRole="customer">{children}</RoleGuard>;
}

