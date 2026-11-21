'use client';

/**
-- ==============================================================================
-- PAGE 1: STOREFRONT (APP ROUTER)
-- Boutique-Industrial hero + 6 Equal-Weight Product Division Tiles + Live Work Gallery
-- ==============================================================================
*/

import React, { useEffect } from 'react';
import { useCatalogue } from '../hooks/useCatalogue';
import { DivisionGrid } from '../components/catalogue/DivisionGrid';
import { LiveWorkGallery } from '../components/catalogue/LiveWorkGallery';
import { Sparkles, Shield, ArrowRight, Layers, FileCheck } from 'lucide-react';

export default function StorefrontPage() {
  const { divisions, gallery, fetchDivisions, fetchGallery, loading } = useCatalogue();

  useEffect(() => {
    fetchDivisions();
    fetchGallery();
  }, [fetchDivisions, fetchGallery]);

  // Fallback division list if backend has not yet seeded all 6
  const displayDivisions =
    divisions.length > 0
      ? divisions
      : [
          {
            id: 'div-1',
            name: 'Labels & Stickers',
            slug: 'stickers-labels',
            description: 'Custom die-cut waterproof vinyl, holographic, and roll decals.',
            sort_order: 1,
          },
          {
            id: 'div-2',
            name: 'Race & Event Numbers',
            slug: 'race-event-numbers',
            description: 'Tyvek bibs, waterproof marathon numbers with barcode variable data.',
            sort_order: 2,
          },
          {
            id: 'div-3',
            name: 'MTB Boards & Signage',
            slug: 'posters-signage',
            description: 'Rigid polypropylene bike number plates and architectural signage.',
            sort_order: 3,
          },
          {
            id: 'div-4',
            name: 'Stamps & Stationery',
            slug: 'business-cards-stationery',
            description: 'Deluxe business cards, corporate letterheads, and laser-engraved rubber stamps.',
            sort_order: 4,
          },
          {
            id: 'div-5',
            name: 'Custom Trophies & Awards',
            slug: 'packaging-boxes',
            description: 'Direct UV printed acrylic awards, medal ribbons, and presentation packaging.',
            sort_order: 5,
          },
          {
            id: 'div-6',
            name: 'Laser-Cut Work',
            slug: 'apparel-merchandise',
            description: 'Precision laser contour cut acrylic, wood plaques, and custom stencils.',
            sort_order: 6,
          },
        ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="border-b border-[#E4E4E7] bg-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-mono text-[#EA580C] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>6 Industrial Print Divisions • Prepress Automation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Precision Web-to-Print Manufacturing <br className="hidden sm:inline" />
            Built for Exacting Standards.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-600 leading-relaxed">
            Configure custom trim sizes to the exact millimeter, upload variable data CSVs, and preview
            proofs with bleed in real time. Backed by Net-30 invoice export and high-res print PDF generation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Prepress Proof Gate Enforced
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#EA580C]" />
              Variable Data CSV Merge
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Automated Xero Invoicing
            </span>
          </div>
        </div>
      </section>

      {/* 6 Equal-Weight Product Division Tiles */}
      <section className="max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-zinc-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Production Divisions
            </h2>
            <p className="text-xs font-mono text-zinc-500 mt-1">
              Select a division to open the parameter configurator & online designer
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#EA580C]">6 Active Divisions</span>
        </div>

        <DivisionGrid divisions={displayDivisions} />
      </section>

      {/* Live Work Gallery */}
      <section className="max-w-[1900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-zinc-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Live Work Gallery
            </h2>
            <p className="text-xs font-mono text-zinc-500 mt-1">
              Real manufactured work samples across our specialized print lines
            </p>
          </div>
        </div>

        <LiveWorkGallery
          items={gallery}
          divisions={displayDivisions}
          onSelectDivision={(div) => fetchGallery(div)}
        />
      </section>
    </div>
  );
}
