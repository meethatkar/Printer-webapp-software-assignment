'use client';

/**
-- ==============================================================================
-- PAGE 4: CUSTOMER DASHBOARD (/dashboard)
-- Strictly Customer Isolated — Renders all 6 required modules:
-- 1. Account & Profile Status (GET/PUT /api/auth/profile)
-- 2. Order History with 6-stage tracker (QUOTE -> COMPLETED)
-- 3. Reusable Saved Designs grid with 1-click reuse
-- 4. Active Proofs & Version State (v1, v2...) with review modal
-- 5. One-Click Reorder
-- 6. Downloadable Invoice / Receipt
-- ==============================================================================
*/

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { useAuth } from '../../hooks/useAuth';
import { useOrders } from '../../hooks/useOrders';
import { useDesigner } from '../../hooks/useDesigner';
import { ProfileCard } from '../../components/dashboard/ProfileCard';
import { OrderHistoryTable } from '../../components/dashboard/OrderHistoryTable';
import { SavedDesignsGrid } from '../../components/dashboard/SavedDesignsGrid';
import { SavedDesign } from '../../types';
import { LayoutDashboard, PlusCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { myOrders, fetchMyOrders, reorderPastOrder, downloadInvoice } = useOrders();
  const { savedDesigns, fetchMySavedDesigns, loadDesign } = useDesigner();
  const [invoiceToast, setInvoiceToast] = useState<string | null>(null);

  useEffect(() => {
    fetchMyOrders();
    fetchMySavedDesigns();
  }, [fetchMyOrders, fetchMySavedDesigns]);

  const handleReorder = async (orderId: string) => {
    await reorderPastOrder(orderId);
    fetchMyOrders();
  };

  const handleDownloadInvoice = async (orderId: string) => {
    const inv = await downloadInvoice(orderId);
    setInvoiceToast(`Invoice ${inv.invoice_number} (£${inv.total_amount.toFixed(2)}) ready.`);
    setTimeout(() => setInvoiceToast(null), 4000);
  };

  const handleSelectDesign = (design: SavedDesign) => {
    loadDesign(design);
    router.push(`/products/${design.product_id || 'stickers-labels'}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#EA580C]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              Customer Production Dashboard
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Welcome back, {user?.full_name || user?.email}. Manage your active orders, revisions, and proofs.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#EA580C] hover:bg-[#D94F04] text-white text-xs font-mono font-bold rounded-md shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Print Order</span>
        </Link>
      </div>

      {invoiceToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{invoiceToast}</span>
        </div>
      )}

      {/* Top Grid: Profile Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>

        {/* Quick Stats Overview */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-xs">
            <span className="text-xs font-mono text-zinc-400">Total Placed Jobs</span>
            <div className="text-2xl font-mono font-bold text-zinc-900 mt-1">{myOrders.length}</div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-xs">
            <span className="text-xs font-mono text-zinc-400">Saved Artwork Files</span>
            <div className="text-2xl font-mono font-bold text-zinc-900 mt-1">{savedDesigns.length}</div>
          </div>
          <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-xs col-span-2 sm:col-span-1 border-l-4 border-l-[#EA580C]">
            <span className="text-xs font-mono text-zinc-400">Active In Production</span>
            <div className="text-2xl font-mono font-bold text-[#EA580C] mt-1">
              {myOrders.filter((o) => o.pipeline_status === 'PRODUCTION').length}
            </div>
          </div>
        </div>
      </div>

      {/* Module 2: Order History & 6-Stage Horizontal Progress Tracker */}
      <OrderHistoryTable
        orders={myOrders}
        onReorder={handleReorder}
        onDownloadInvoice={handleDownloadInvoice}
        onRefreshOrders={fetchMyOrders}
      />

      {/* Module 3: Reusable Saved Designs Grid */}
      <SavedDesignsGrid designs={savedDesigns} onSelectDesign={handleSelectDesign} />
    </div>
  );
}
