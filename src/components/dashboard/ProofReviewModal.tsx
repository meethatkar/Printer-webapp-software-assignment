'use client';

/**
-- ==============================================================================
-- PROOF REVIEW & APPROVAL GATE MODAL (DASHBOARD LAYER)
-- Inspects v1, v2... revisions, records approval audit trail, or requests changes.
-- ==============================================================================
*/

import React, { useState, useEffect } from 'react';
import { Order, ProofVersion } from '../../types';
import { useOrders } from '../../hooks/useOrders';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, Send } from 'lucide-react';

interface ProofReviewModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const ProofReviewModal: React.FC<ProofReviewModalProps> = ({ order, isOpen, onClose }) => {
  const { fetchOrderProofs, activeOrderProofs, approveCustomerProof, requestProofChanges, submitProofRevision, loading } = useOrders();
  const [proofs, setProofs] = useState<ProofVersion[]>([]);
  const [selectedProof, setSelectedProof] = useState<ProofVersion | null>(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    if (order.id) {
      fetchOrderProofs(order.id).then((res) => {
        setProofs(res);
        if (res.length > 0) {
          // Select latest revision
          setSelectedProof(res[res.length - 1]);
        }
      });
    }
  }, [order.id, fetchOrderProofs]);

  const handleApprove = async () => {
    if (!selectedProof) return;
    await approveCustomerProof(selectedProof.id, order.id);
    onClose();
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProof || !changeNotes.trim()) return;
    await requestProofChanges(selectedProof.id, order.id, changeNotes);
    setShowRequestForm(false);
    setChangeNotes('');
    fetchOrderProofs(order.id);
  };

  const isApproved = selectedProof?.status === 'APPROVED' || order.approved_proof_id === selectedProof?.id;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Prepress Proof Audit — Order ${order.order_code}`} maxWidth="2xl">
      <div className="space-y-6">
        {/* Revision Selector Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Revisions:</span>
            {proofs.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProof(p)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                  selectedProof?.id === p.id
                    ? 'bg-[#18181B] text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                v{p.version_number}
              </button>
            ))}
          </div>
          {selectedProof && <Badge status={selectedProof.status} />}
        </div>

        {/* Visual Proof Simulation Container */}
        {selectedProof && (
          <div className="relative bg-zinc-100 rounded-lg p-6 border border-zinc-200 flex flex-col items-center justify-center min-h-60">
            {/* Bleed line (red dashed) */}
            <div
              className="relative bg-white border-2 border-dashed border-red-500/80 shadow-md p-4 flex flex-col items-center justify-center text-center"
              style={{
                width: `${Math.min(320, (order.config_json.width_mm || 85) * 3)}px`,
                height: `${Math.min(220, (order.config_json.height_mm || 55) * 3)}px`,
              }}
            >
              {/* Safe Print Zone (blue dashed) */}
              <div className="absolute inset-2 border border-dashed border-blue-500/60 pointer-events-none" />

              {/* Elements */}
              {selectedProof.design_snapshot_json?.elements?.map((el) => (
                <div key={el.id} className="text-zinc-900 font-sans" style={{ fontSize: `${el.fontSize || 12}px` }}>
                  {el.text}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 mt-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-red-500 inline-block" /> 3mm Bleed Margin
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-blue-500 inline-block" /> Safe Print Area
              </span>
              <span>300 DPI Prepress Standard</span>
            </div>
          </div>
        )}

        {/* Audit Details */}
        {selectedProof && (
          <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200 text-xs font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-zinc-500">Version:</span>
              <span className="font-bold text-zinc-900">Revision v{selectedProof.version_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Created:</span>
              <span className="text-zinc-800">{new Date(selectedProof.created_at).toLocaleString()}</span>
            </div>
            {selectedProof.approved_at && (
              <div className="flex justify-between text-emerald-700">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Approved By:
                </span>
                <span className="font-bold">{new Date(selectedProof.approved_at).toLocaleString()}</span>
              </div>
            )}
            {selectedProof.change_request_notes && (
              <div className="pt-2 border-t border-zinc-200 text-amber-700">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Change Notes:
                </div>
                <div className="text-zinc-700 mt-0.5">&ldquo;{selectedProof.change_request_notes}&rdquo;</div>
              </div>
            )}
          </div>
        )}

        {/* Change Request Form */}
        {showRequestForm ? (
          <form onSubmit={handleRequestChanges} className="space-y-3 pt-2 border-t border-zinc-200">
            <label className="block text-xs font-mono font-bold text-zinc-900">
              Change Request Instructions (Pauses production):
            </label>
            <textarea
              rows={3}
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="e.g. Please increase name font size and center the logo..."
              className="w-full text-xs p-3 rounded-md border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              required
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" type="button" onClick={() => setShowRequestForm(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="secondary" type="submit" isLoading={loading}>
                <Send className="w-3.5 h-3.5 mr-1" />
                Submit Revision Request
              </Button>
            </div>
          </form>
        ) : (
          /* Approval Gate Actions */
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
            <div>
              {!isApproved && (
                <button
                  type="button"
                  onClick={() => setShowRequestForm(true)}
                  className="text-xs font-mono font-medium text-amber-700 hover:underline"
                >
                  Request Changes
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="md" onClick={onClose}>
                Close
              </Button>

              {isApproved ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-md font-mono text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Officially Approved</span>
                </div>
              ) : (
                <Button variant="primary" size="md" isLoading={loading} onClick={handleApprove}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Approve Proof (Unlock Print)
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

