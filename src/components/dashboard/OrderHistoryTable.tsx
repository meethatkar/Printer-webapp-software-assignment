'use client';

/**
-- ==============================================================================
-- ORDER HISTORY TABLE COMPONENT (DASHBOARD LAYER)
-- Modules 2, 4, 5, 6: 6-stage tracker, Active Proofs, Reorder, Download Invoice
-- ==============================================================================
*/

import React, { useState } from 'react';
import { Order } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PipelineStepper } from '../ui/PipelineStepper';
import { FileText, RotateCcw, Eye, Download, CheckCircle2, Clock } from 'lucide-react';
import { ProofReviewModal } from './ProofReviewModal';

interface OrderHistoryTableProps {
  orders: Order[];
  onReorder: (orderId: string) => Promise<void>;
  onDownloadInvoice: (orderId: string) => Promise<void>;
  onRefreshOrders: () => void;
}

export const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({
  orders,
  onReorder,
  onDownloadInvoice,
  onRefreshOrders,
}) => {
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleReorderClick = async (orderId: string) => {
    setReorderingId(orderId);
    try {
      await onReorder(orderId);
      onRefreshOrders();
    } finally {
      setReorderingId(null);
    }
  };

  const handleDownloadInvoiceClick = async (orderId: string) => {
    setDownloadingId(orderId);
    try {
      await onDownloadInvoice(orderId);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#EA580C]" />
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900">
              Order History & Pipeline Tracking ({orders.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">Net-30 Invoice Ready</span>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500 font-mono">
            You haven&apos;t placed any print orders yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {orders.map((order) => {
              const isProofPending =
                order.pipeline_status === 'PROOF' || (!order.approved_proof_id && order.pipeline_status === 'ORDER');

              return (
                <div key={order.id} className="p-4 sm:p-6 hover:bg-zinc-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-zinc-900">{order.order_code}</span>
                        <Badge status={order.pipeline_status} />
                        <span className="text-[11px] font-mono text-zinc-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-600 mt-1 font-mono">
                        {order.config_json.width_mm}×{order.config_json.height_mm}mm • Qty: {order.quantity} • Total: £
                        {Number(order.total_amount).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Active Proofs Review Action */}
                      <Button
                        size="sm"
                        variant={isProofPending ? 'primary' : 'outline'}
                        onClick={() => setSelectedProofOrder(order)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        <span>
                          {order.approved_proof_id ? 'Inspect Approved Proof' : 'Review & Approve Proof'}
                        </span>
                      </Button>

                      {/* One-Click Reorder Action */}
                      <Button
                        size="sm"
                        variant="outline"
                        isLoading={reorderingId === order.id}
                        onClick={() => handleReorderClick(order.id)}
                        className="text-xs"
                        title="1-Click Reorder using previous design & parameters"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        <span>Reorder</span>
                      </Button>

                      {/* Download Invoice Action */}
                      <Button
                        size="sm"
                        variant="ghost"
                        isLoading={downloadingId === order.id}
                        onClick={() => handleDownloadInvoiceClick(order.id)}
                        className="text-xs"
                        title="Download official receipt / invoice"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* 6-Stage Pipeline Tracker */}
                  <div className="pt-2 border-t border-zinc-100">
                    <PipelineStepper currentStatus={order.pipeline_status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Proof Review Modal */}
      {selectedProofOrder && (
        <ProofReviewModal
          order={selectedProofOrder}
          isOpen={Boolean(selectedProofOrder)}
          onClose={() => {
            setSelectedProofOrder(null);
            onRefreshOrders();
          }}
        />
      )}
    </>
  );
};

