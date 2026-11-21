'use client';

/**
-- ==============================================================================
-- ROLE GUARD (ROUTE PROTECTION)
-- Enforces customer isolation on /dashboard and admin isolation on /admin
-- ==============================================================================
*/

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface RoleGuardProps {
  requiredRole?: 'customer' | 'admin';
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ requiredRole, children }) => {
  const router = useRouter();
  const { user, token, role } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!token) {
      router.replace('/auth');
      return;
    }

    if (requiredRole === 'admin' && role !== 'admin') {
      router.replace('/dashboard');
      return;
    }
  }, [mounted, token, role, requiredRole, router]);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EA580C] animate-spin" />
      </div>
    );
  }

  if (!token) {
    return null;
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border border-red-200 rounded-lg text-center">
        <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-zinc-900">Access Restricted</h3>
        <p className="text-sm text-zinc-600 mt-1">
          This section requires administrative privileges.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

