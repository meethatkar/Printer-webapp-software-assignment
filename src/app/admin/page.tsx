'use client';

/**
-- ==============================================================================
-- PAGE 5: ADMIN PRODUCTION DASHBOARD (/admin)
-- Strictly role === 'admin'
-- Top KPI Analytics Cards + Searchable Job DB + Pipeline Stage Progression +
-- Approval Gate Print File Downloads + Users Management Tab
-- ==============================================================================
*/

import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';

import { AnalyticsCards } from '../../components/admin/AnalyticsCards';
import { OrderFilterBar } from '../../components/admin/OrderFilterBar';
import { PipelineTable } from '../../components/admin/PipelineTable';
import { PrintFileActions } from '../../components/admin/PrintFileActions';
import { UsersTable } from '../../components/admin/UsersTable';
import { Order } from '../../types';
import { Shield, Layers, Users, BarChart3, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    allOrders,
    analytics,
    users,
    filters,
    activeTab,
    generatingOrderId,
    generationStep,
    fetchOrders,
    advanceStage,
    archiveOrder,
    generatePrintFileWithLaborIllusion,
    downloadPrintFile,
    fetchAnalytics,
    exportXero,
    fetchUsers,
    updateUserRole,
    setFilterState,
    setTab,
  } = useAdmin();

  const [selectedPrintOrder, setSelectedPrintOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchAnalytics();
    fetchUsers();
  }, [fetchOrders, fetchAnalytics, fetchUsers]);

  return (
    <div className="max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#EA580C]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              Admin Prepress & Production Center
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Manufacturing pipeline management, approval gate enforcement, and Xero export
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg text-xs font-mono font-semibold">
          <button
            onClick={() => setTab('pipeline')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'pipeline' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Jobs Pipeline</span>
          </button>
          <button
            onClick={() => setTab('analytics')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics & Xero</span>
          </button>
          <button
            onClick={() => setTab('users')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Pipeline Management */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <AnalyticsCards analytics={analytics} onExportXero={exportXero} />

          <div className="space-y-4">
            <OrderFilterBar
              statusFilter={filters.status}
              isArchivedFilter={filters.is_archived}
              searchQuery={filters.search}
              onFilterChange={(newFilters) => {
                setFilterState(newFilters);
                fetchOrders();
              }}
            />

            <PipelineTable
              orders={allOrders}
              onAdvanceStage={advanceStage}
              onArchiveOrder={archiveOrder}
              onSelectOrderForPrint={(order) => setSelectedPrintOrder(order)}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Analytics & Reports */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <AnalyticsCards analytics={analytics} onExportXero={exportXero} />
        </div>
      )}

      {/* Tab 3: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <UsersTable users={users} onUpdateRole={updateUserRole} />
        </div>
      )}

      {/* Server Print Engine & Labor Illusion Modal */}
      {selectedPrintOrder && (
        <PrintFileActions
          order={selectedPrintOrder}
          isOpen={Boolean(selectedPrintOrder)}
          onClose={() => setSelectedPrintOrder(null)}
          onGeneratePrint={generatePrintFileWithLaborIllusion}
          onDownloadPrint={downloadPrintFile}
          generationStep={generationStep}
          isGenerating={generatingOrderId === selectedPrintOrder.id}
        />
      )}
    </div>
  );
}
