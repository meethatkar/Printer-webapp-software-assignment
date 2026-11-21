'use client';

/**
-- ==============================================================================
-- PROFILE STATUS CARD COMPONENT (DASHBOARD LAYER)
-- Module 1: Account & Profile Status (GET/PUT /api/auth/profile)
-- ==============================================================================
*/

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { User, Building, Mail, Shield, Check } from 'lucide-react';

export const ProfileCard: React.FC = () => {
  const { user, updateProfile, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [companyName, setCompanyName] = useState(user?.company_name || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ full_name: fullName, company_name: companyName });
    setSavedSuccess(true);
    setEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#EA580C]" />
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900">
              Account & Profile Status
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Shield className="w-3 h-3" />
            <span>Active {user?.role}</span>
          </span>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-mono text-zinc-600 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-md border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-600 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-md border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" type="submit" isLoading={loading}>
                Save Profile
              </Button>
              <Button size="sm" variant="ghost" type="button" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-zinc-600">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono text-zinc-900 font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>{user?.full_name || 'No name configured'}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Building className="w-3.5 h-3.5 text-zinc-400" />
              <span>{user?.company_name || 'Individual Customer'}</span>
            </div>
          </div>
        )}
      </div>

      {!editing && (
        <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
          <button
            onClick={() => {
              setFullName(user?.full_name || '');
              setCompanyName(user?.company_name || '');
              setEditing(true);
            }}
            className="text-xs font-mono font-medium text-[#EA580C] hover:underline"
          >
            Edit Profile
          </button>
          {savedSuccess && (
            <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

