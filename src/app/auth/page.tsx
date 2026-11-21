'use client';

/**
-- ==============================================================================
-- PAGE 2: AUTH (/auth)
-- Tabbed Sign In / Sign Up form with role-based redirect
-- (customer -> /dashboard, admin -> /admin)
-- ==============================================================================
*/

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Lock, Mail, User, Building, ArrowRight, Shield } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, loading, error } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tab === 'signin') {
        const res = await login({ email, password });
        if (res.profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        const res = await signup({
          email,
          password,
          full_name: fullName,
          company_name: companyName,
        });
        if (res.profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch {
      // Error is stored in auth slice
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {tab === 'signin' ? 'Sign In to Your Workspace' : 'Create Customer Account'}
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            {tab === 'signin'
              ? 'Access saved designs, active proofs, and order history'
              : 'Save reusable custom artwork with 1-click reordering'}
          </p>
        </div>

        <Card padding="lg" className="border-zinc-300 shadow-sm">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-lg text-xs font-mono font-semibold mb-6">
            <button
              type="button"
              onClick={() => setTab('signin')}
              className={`py-2 rounded transition-colors ${
                tab === 'signin' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`py-2 rounded transition-colors ${
                tab === 'signup' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs font-mono text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-zinc-600 font-bold mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full h-10 pl-9 pr-3 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 font-bold mb-1">Company / Organization</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Prints Ltd."
                      className="w-full h-10 pl-9 pr-3 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-zinc-600 font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-10 pl-9 pr-3 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-600 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-9 pr-3 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2 font-bold"
            >
              <span>{tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

