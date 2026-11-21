'use client';

/**
-- ==============================================================================
-- SAVED DESIGNS GRID COMPONENT (DASHBOARD LAYER)
-- Module 3: Reusable Artwork for 1-Click Reorders
-- ==============================================================================
*/

import React from 'react';
import Link from 'next/link';
import { SavedDesign } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Layers, ArrowRight } from 'lucide-react';

interface SavedDesignsGridProps {
  designs: SavedDesign[];
  onSelectDesign: (design: SavedDesign) => void;
}

export const SavedDesignsGrid: React.FC<SavedDesignsGridProps> = ({ designs, onSelectDesign }) => {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#EA580C]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900">
            Reusable Saved Designs ({designs.length})
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">1-Click Reorder Ready</span>
      </div>

      {designs.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-500 font-mono">
          No saved artwork designs found. Customize a product to save a reusable template.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 sm:p-5">
          {designs.map((design) => (
            <div
              key={design.id}
              className="p-4 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-zinc-900 truncate">{design.title}</h4>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {new Date(design.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-500 space-y-1">
                  <div>
                    Dimensions: {design.config_json.width_mm}×{design.config_json.height_mm}mm
                  </div>
                  <div>Elements: {design.design_json?.elements?.length || 0} layers</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between">
                <Button size="sm" variant="outline" onClick={() => onSelectDesign(design)} className="text-xs w-full">
                  <span>Open in Designer</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

