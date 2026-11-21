'use client';

/**
-- ==============================================================================
-- PRINT FILE ACTIONS & LABOR ILLUSION MODAL (ADMIN LAYER)
-- Enforces Approval Gate (rejects if approved_proof_id is null).
-- Displays Staged Labor Illusion UI during generation:
-- 1. "Checking approval gate..."
-- 2. "Merging CSV variable rows & fitting fonts..."
-- 3. "Rendering high-res PDF with bleeds & crop marks..."
-- ==============================================================================
*/

import React, { useState } from 'react';
import { Order, PrintFileDownloadResponse } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldCheck, ShieldAlert, FileText, Download, CheckCircle2, Loader2, Printer } from 'lucide-react';

interface PrintFileActionsProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onGeneratePrint: (orderId: string) => Promise<any>;
  onDownloadPrint: (orderId: string) => Promise<PrintFileDownloadResponse>;
  generationStep: string | null;
  isGenerating: boolean;
}

export const PrintFileActions: React.FC<PrintFileActionsProps> = ({
  order,
  isOpen,
  onClose,
  onGeneratePrint,
  onDownloadPrint,
  generationStep,
  isGenerating,
}) => {
  const [downloadInfo, setDownloadInfo] = useState<PrintFileDownloadResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!order) return null;

  const isApproved = Boolean(order.approved_proof_id);

  const handleGenerate = async () => {
    setErrorMsg(null);
    try {
      await onGeneratePrint(order.id);
      const dl = await onDownloadPrint(order.id);
      setDownloadInfo(dl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation blocked. Approval gate enforced.');
    }
  };

  const handleDownload = async () => {
    try {
      const dl = await onDownloadPrint(order.id);
      window.open(dl.download_url, '_blank');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Server Print Engine — Job ${order.order_code}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Prepress Gate Banner */}
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            isApproved
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          {isApproved ? (
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
          )}

          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
              {isApproved
                ? 'Approval Gate: UNLOCKED (Proof Approved)'
                : 'Approval Gate: LOCKED (Awaiting Customer Sign-off)'}
            </h4>
            <p className="text-xs mt-1 leading-relaxed">
              {isApproved
                ? 'Client has officially approved this proof. Prepress PDF generation and CSV variable data merging are unlocked.'
                : 'Production files are strictly protected until the customer signs off on revision v1/v2.'}
            </p>
          </div>
        </div>

        {/* Staged Labor Illusion UI */}
        {isGenerating && (
          <div className="bg-zinc-900 text-white p-5 rounded-lg font-mono text-xs space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-[#EA580C] font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>PRINT ENGINE COMPILING</span>
            </div>
            <div className="space-y-1.5 pl-6 text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> <span>Checking approval gate database status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> <span>Fitting print zone boundaries and auto shrink</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="text-[#EA580C] animate-pulse">●</span> <span>{generationStep}</span>
              </div>
            </div>
          </div>
        )}

        {/* Output File Information */}
        {downloadInfo && (
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Production PDF Generated Successfully</span>
            </div>
            <div className="text-zinc-800 break-all font-semibold">{downloadInfo.file_name}</div>
            <div className="text-zinc-500">
              Format: {downloadInfo.file_format} • Items: {downloadInfo.row_count}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs font-mono text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
          <Button variant="outline" size="md" onClick={onClose}>
            Close
          </Button>

          {downloadInfo ? (
            <Button variant="primary" size="md" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download Ready PDF
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              disabled={!isApproved}
              isLoading={isGenerating}
              onClick={handleGenerate}
            >
              <Printer className="w-4 h-4 mr-2" />
              Generate Production PDF
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

