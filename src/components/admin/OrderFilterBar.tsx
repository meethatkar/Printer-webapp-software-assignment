'use client';

/**
-- ==============================================================================
-- ORDER FILTER BAR COMPONENT (ADMIN LAYER)
-- Searchable Job Database filter inputs
-- ==============================================================================
*/

import React from 'react';
import { PipelineStatus } from '../../types';
import { Search, Filter, Archive } from 'lucide-react';

interface OrderFilterBarProps {
  statusFilter?: PipelineStatus;
  isArchivedFilter?: boolean;
  searchQuery?: string;
  onFilterChange: (filters: { status?: PipelineStatus; is_archived?: boolean; search?: string }) => void;
}

export const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  statusFilter,
  isArchivedFilter = false,
  searchQuery = '',
  onFilterChange,
}) => {
  const statuses: (PipelineStatus | 'ALL')[] = [
    'ALL',
    'QUOTE',
    'ORDER',
    'ARTWORK',
    'PROOF',
    'PRODUCTION',
    'COMPLETED',
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search Order Code, Invoice..."
          className="w-full text-xs font-mono h-9 pl-9 pr-3 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
        />
      </div>

      {/* Stage Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
        {statuses.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => onFilterChange({ status: st === 'ALL' ? undefined : (st as PipelineStatus) })}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors whitespace-nowrap ${
              (st === 'ALL' && !statusFilter) || statusFilter === st
                ? 'bg-[#18181B] text-white font-bold'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Archive Toggle */}
      <button
        type="button"
        onClick={() => onFilterChange({ is_archived: !isArchivedFilter })}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors shrink-0 ${
          isArchivedFilter
            ? 'bg-amber-100 text-amber-800 border border-amber-300'
            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
        }`}
      >
        <Archive className="w-3.5 h-3.5" />
        <span>{isArchivedFilter ? 'Showing Archived' : 'Show Archived'}</span>
      </button>
    </div>
  );
};

