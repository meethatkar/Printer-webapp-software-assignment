'use client';

/**
-- ==============================================================================
-- BOUTIQUE-INDUSTRIAL FOOTER (UI LAYER)
-- ==============================================================================
*/

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#18181B] text-zinc-400 border-t border-zinc-800 py-12 mt-auto">
      <div className="max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold tracking-tight text-base mb-3">PRINTPLATFORM</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            High-precision parameter-driven print manufacturing. Serving 6 specialized industrial divisions with automated prepress proofing.
          </p>
        </div>

        <div>
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-3">
            Core Divisions
          </h5>
          <ul className="text-xs space-y-2">
            <li>Labels & Stickers</li>
            <li>Race & Event Numbers</li>
            <li>MTB Boards & Signs</li>
            <li>Laser Stamps & Seals</li>
            <li>Custom Trophies & Awards</li>
            <li>Laser-Cut Work</li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-3">
            Production Standards
          </h5>
          <ul className="text-xs space-y-2 font-mono">
            <li>• 300 DPI High-Resolution</li>
            <li>• 3.0mm Standard Bleed Margins</li>
            <li>• Auto Shrink-to-Fit Variable Data</li>
            <li>• Gated PDF Prepress Pipeline</li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 mb-3">
            Accounting & Dispatch
          </h5>
          <p className="text-xs text-zinc-400 mb-2">
            Automated Net-30 Xero Accounts Receivable invoice export and Stripe card payments.
          </p>
          <div className="text-[11px] font-mono text-zinc-500">
            © 2026 PrintPlatform Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
