'use client';

/**
-- ==============================================================================
-- ADMIN PRODUCTION DASHBOARD ROUTE GUARD LAYOUT
-- Strictly role === 'admin'
-- ==============================================================================
*/

import React from 'react';
import { RoleGuard } from '../../components/layout/RoleGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard requiredRole="admin">{children}</RoleGuard>;
}

