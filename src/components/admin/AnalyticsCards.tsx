'use client';

/**
-- ==============================================================================
-- ANALYTICS CARDS COMPONENT (ADMIN LAYER)
-- KPI Cards: Total Orders, Total Revenue, Throughput + Export Xero CSV
-- ==============================================================================
*/

import React from 'react';
import { AdminAnalytics } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PoundSterling, Package, Clock, CheckCircle, Download, FileSpreadsheet } from 'lucide-react';

interface AnalyticsCardsProps {
  analytics: AdminAnalytics | null;
  onExportXero: () => Promise<any>;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ analytics, onExportXero }) => {
  const [exporting, setExporting] = React.useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await onExportXero();
      // Generate client-side JSON download
      const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Xero_Invoices_Export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Production & Revenue Analytics</h2>
          <p className="text-xs text-zinc-500 font-mono">Live throughput across all 6 industrial divisions</p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          isLoading={exporting}
          onClick={handleExport}
          className="text-xs font-mono"
        >
          <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-400" />
          <span>Export Xero Invoices (JSON)</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="border-l-4 border-l-[#EA580C]">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono mb-1">
            <span>Total Revenue</span>
            <PoundSterling className="w-4 h-4 text-[#EA580C]" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900">
            £{analytics ? analytics.total_revenue.toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 mt-1">
            Paid: £{analytics ? analytics.paid_revenue.toFixed(2) : '0.00'}
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono mb-1">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900">
            {analytics?.total_orders || 0}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-1">Jobs logged</div>
        </Card>

        <Card padding="md" className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono mb-1">
            <span>Pending Proofs</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900">
            {analytics?.pending_proofs || 0}
          </div>
          <div className="text-[11px] font-mono text-amber-600 mt-1">Awaiting client sign-off</div>
        </Card>

        <Card padding="md" className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono mb-1">
            <span>Completed Work</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900">
            {analytics?.completed_jobs || 0}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 mt-1">Fulfilled & dispatched</div>
        </Card>
      </div>
    </div>
  );
};

