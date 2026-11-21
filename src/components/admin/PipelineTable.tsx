'use client';

/**
-- ==============================================================================
-- PIPELINE TABLE COMPONENT (ADMIN LAYER)
-- Searchable Job Database + Stage selector + Archive action
-- ==============================================================================
*/

import React from 'react';
import { Order, PipelineStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { Archive, ArrowRight, Printer } from 'lucide-react';

interface PipelineTableProps {
  orders: Order[];
  onAdvanceStage: (orderId: string, status: PipelineStatus) => Promise<any>;
  onArchiveOrder: (orderId: string, isArchived: boolean) => Promise<any>;
  onSelectOrderForPrint: (order: Order) => void;
}

export const PipelineTable: React.FC<PipelineTableProps> = ({
  orders,
  onAdvanceStage,
  onArchiveOrder,
  onSelectOrderForPrint,
}) => {
  const stages: PipelineStatus[] = ['QUOTE', 'ORDER', 'ARTWORK', 'PROOF', 'PRODUCTION', 'COMPLETED'];

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Order Code / Invoice</th>
              <th className="py-3 px-4">Specs & Qty</th>
              <th className="py-3 px-4">Total (Inc. VAT)</th>
              <th className="py-3 px-4">Stage Transition</th>
              <th className="py-3 px-4">Prepress Gate</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-zinc-400">
                  No orders match current filter criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isProofApproved = Boolean(order.approved_proof_id);

                return (
                  <tr key={order.id} className="hover:bg-zinc-50/70 transition-colors">
                    {/* Order Code */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-zinc-900">{order.order_code}</div>
                      <div className="text-[10px] text-zinc-400">{order.invoice_number || 'INV-PENDING'}</div>
                    </td>

                    {/* Specs */}
                    <td className="py-3 px-4">
                      <div className="text-zinc-800">
                        {order.config_json?.width_mm}×{order.config_json?.height_mm}mm
                      </div>
                      <div className="text-[10px] text-zinc-500">Qty: {order.quantity} units</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-bold text-zinc-900">
                      £{Number(order.total_amount).toFixed(2)}
                    </td>

                    {/* Stage Selector */}
                    <td className="py-3 px-4">
                      <select
                        value={order.pipeline_status}
                        onChange={(e) => onAdvanceStage(order.id, e.target.value as PipelineStatus)}
                        className="h-8 px-2 rounded border border-zinc-300 text-xs font-mono font-medium bg-white focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                      >
                        {stages.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Prepress Approval Gate Indicator */}
                    <td className="py-3 px-4">
                      {isProofApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                          ✓ Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                          🔒 Locked (No Approval)
                        </span>
                      )}
                    </td>

                    {/* Action: Open Print File Modal or Archive */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => onSelectOrderForPrint(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#18181B] hover:bg-zinc-800 text-white font-medium text-xs transition-colors"
                        title="Print File Engine"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span>Print Engine</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onArchiveOrder(order.id, !order.is_archived)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-600 transition-colors"
                        title={order.is_archived ? 'Restore' : 'Archive'}
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

