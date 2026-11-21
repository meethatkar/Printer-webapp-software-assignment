'use client';

/**
-- ==============================================================================
-- PRICE SUMMARY CARD COMPONENT (CATALOGUE LAYER)
-- Tabular monospace pricing, VAT breakdown, Volume discount badge,
-- "Save Design" & "Checkout & Generate Proof" CTAs
-- ==============================================================================
*/

import React from 'react';
import { QuoteBreakdown } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Bookmark, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

interface PriceSummaryCardProps {
  quote: QuoteBreakdown | null;
  loading: boolean;
  onSaveDesign: () => void;
  onCheckout: () => void;
}

export const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  quote,
  loading,
  onSaveDesign,
  onCheckout,
}) => {
  return (
    <Card className="sticky top-20 space-y-5 border-zinc-300 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900">
          Live Instant Quote
        </h3>
        {quote && quote.discount_pct > 0 && (
          <Badge variant="accent">
            <Zap className="w-3 h-3 mr-1" />
            {quote.discount_pct}% Volume Off
          </Badge>
        )}
      </div>

      {quote ? (
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex justify-between text-zinc-500">
            <span>Per Unit Rate:</span>
            <span className="text-zinc-900 font-semibold">£{quote.unit_price.toFixed(4)}</span>
          </div>

          <div className="flex justify-between text-zinc-500">
            <span>Gross Subtotal ({quote.quantity} units):</span>
            <span className="text-zinc-900">£{quote.subtotal.toFixed(2)}</span>
          </div>

          {quote.discount_amount > 0 && (
            <div className="flex justify-between text-[#EA580C] font-semibold">
              <span>Volume Discount ({quote.discount_pct}%):</span>
              <span>-£{quote.discount_amount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-zinc-500">
            <span>VAT ({(quote.vat_rate * 100).toFixed(0)}%):</span>
            <span className="text-zinc-900">£{quote.vat_amount.toFixed(2)}</span>
          </div>

          <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
            <span className="text-sm font-bold text-zinc-900">Total (Inc. VAT):</span>
            <span className="text-xl font-bold font-mono text-[#EA580C]">
              £{quote.total_amount.toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-xs font-mono text-zinc-400">
          {loading ? 'Calculating live quote...' : 'Adjust dimensions or volume to view live quote.'}
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="pt-3 space-y-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full text-sm font-bold tracking-tight shadow-md"
          onClick={onCheckout}
          disabled={!quote}
        >
          <span>Checkout & Generate Proof</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <Button
          variant="outline"
          size="md"
          className="w-full text-xs font-mono"
          onClick={onSaveDesign}
        >
          <Bookmark className="w-3.5 h-3.5 mr-1.5" />
          <span>Save Design (1-Click Reorder)</span>
        </Button>
      </div>

      <div className="pt-2 text-[11px] font-mono text-zinc-400 text-center flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
        <span>Prepress Proof v1 Auto-Generated On Order</span>
      </div>
    </Card>
  );
};

