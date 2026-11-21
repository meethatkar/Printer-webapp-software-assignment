'use client';

/**
-- ==============================================================================
-- NOTIFICATIONS PANEL COMPONENT (DASHBOARD LAYER)
-- ==============================================================================
*/

import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CheckCheck, Bell, ExternalLink } from 'lucide-react';

export const NotificationsPanel: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { notifications, fetchNotifications, markNotificationRead, markAllNotificationsRead } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#EA580C]" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
            Lifecycle Alerts ({notifications.filter((n) => !n.is_read).length})
          </h4>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={() => markAllNotificationsRead()}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-900 flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="mt-2 divide-y divide-zinc-100 max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-400 font-mono">
            No alerts logged yet.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`py-2.5 px-2 rounded-md transition-colors cursor-pointer text-xs ${
                item.is_read ? 'opacity-70 hover:bg-zinc-50' : 'bg-orange-50/50 hover:bg-orange-50 font-medium'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-0.5">
                <span>{item.event_type}</span>
                <span>{new Date(item.sent_at).toLocaleDateString()}</span>
              </div>
              <div className="text-zinc-900 font-semibold">{item.subject}</div>
              <p className="text-zinc-600 mt-0.5 text-[11px] leading-relaxed">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

