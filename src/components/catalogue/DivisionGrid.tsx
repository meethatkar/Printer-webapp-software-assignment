'use client';

/**
-- ==============================================================================
-- DIVISION GRID COMPONENT (CATALOGUE LAYER)
-- Storefront: 6 Equal-Weight Product Division Tiles
-- ==============================================================================
*/

import React from 'react';
import Link from 'next/link';
import { ProductDivision } from '../../types';
import { Card } from '../ui/Card';
import { ArrowUpRight, Tag, Bike, Trophy, Stamp, Sparkles, Box } from 'lucide-react';

interface DivisionGridProps {
  divisions: ProductDivision[];
}

export const DivisionGrid: React.FC<DivisionGridProps> = ({ divisions }) => {
  // Map division icons
  const getDivisionIcon = (slug: string) => {
    switch (slug) {
      case 'labels-stickers':
      case 'stickers-labels':
        return <Tag className="w-5 h-5 text-[#EA580C]" />;
      case 'race-event-numbers':
        return <Sparkles className="w-5 h-5 text-[#EA580C]" />;
      case 'mtb-boards':
      case 'posters-signage':
        return <Bike className="w-5 h-5 text-[#EA580C]" />;
      case 'stamps':
      case 'business-cards-stationery':
        return <Stamp className="w-5 h-5 text-[#EA580C]" />;
      case 'trophies':
      case 'packaging-boxes':
        return <Trophy className="w-5 h-5 text-[#EA580C]" />;
      default:
        return <Box className="w-5 h-5 text-[#EA580C]" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {divisions.map((division) => (
        <Link key={division.id} href={`/products/${division.slug}`} className="group block">
          <Card
            hoverEffect
            className="h-full flex flex-col justify-between p-6 relative overflow-hidden bg-white"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                  {getDivisionIcon(division.slug)}
                </div>
                <span className="text-zinc-300 group-hover:text-[#EA580C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>

              <h3 className="font-bold text-base text-zinc-900 group-hover:text-[#EA580C] transition-colors tracking-tight">
                {division.name}
              </h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-2">
                {division.description || 'Parameter-driven custom industrial print manufacturing with 300 DPI proofing.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-400 group-hover:text-zinc-600 transition-colors">
              <span>Division 0{division.sort_order}</span>
              <span className="font-semibold text-[#EA580C]">Configure & Quote →</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

