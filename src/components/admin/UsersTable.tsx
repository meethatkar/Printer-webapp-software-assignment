'use client';

/**
-- ==============================================================================
-- USERS TABLE COMPONENT (ADMIN LAYER)
-- User management table with customer/admin role toggle
-- ==============================================================================
*/

import React from 'react';
import { User } from '../../types';
import { Shield, ShieldAlert, User as UserIcon } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  onUpdateRole: (userId: string, role: 'customer' | 'admin') => Promise<any>;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, onUpdateRole }) => {
  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-[#EA580C]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900">
            Registered Users & Role Permissions ({users.length})
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">User Email</th>
              <th className="py-3 px-4">Full Name</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Current Role</th>
              <th className="py-3 px-4 text-right">Switch Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-400">
                  No users loaded.
                </td>
              </tr>
            ) : (
              users.map((usr) => (
                <tr key={usr.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-zinc-900">{usr.email}</td>
                  <td className="py-3 px-4 text-zinc-700">{usr.full_name || '—'}</td>
                  <td className="py-3 px-4 text-zinc-700">{usr.company_name || '—'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-bold border ${
                        usr.role === 'admin'
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      <Shield className="w-3 h-3 text-[#EA580C]" />
                      <span>{usr.role}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onUpdateRole(usr.id, usr.role === 'admin' ? 'customer' : 'admin')}
                      className="text-xs text-[#EA580C] hover:underline font-semibold"
                    >
                      Promote to {usr.role === 'admin' ? 'customer' : 'admin'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

