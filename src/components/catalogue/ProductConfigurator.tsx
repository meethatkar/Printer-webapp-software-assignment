'use client';

/**
-- ==============================================================================
-- PRODUCT CONFIGURATOR COMPONENT (CATALOGUE LAYER)
-- Sticky Configurator inputs: Width (mm), Height (mm), Material, Orientation, Qty pills
-- Decoy Effect volume discount pills
-- ==============================================================================
*/

import React from 'react';
import { Product, DesignConfig } from '../../types';
import { Card } from '../ui/Card';
import { Sliders, Sparkles } from 'lucide-react';

interface ProductConfiguratorProps {
  product: Product;
  config: DesignConfig;
  quantity: number;
  onConfigChange: (updates: Partial<DesignConfig>) => void;
  onQuantityChange: (qty: number) => void;
}

export const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({
  product,
  config,
  quantity,
  onConfigChange,
  onQuantityChange,
}) => {
  const quantityPills = [
    { qty: 50, label: '50 units', badge: null },
    { qty: 100, label: '100 units', badge: 'Save 10%' },
    { qty: 250, label: '250 units', badge: 'Best Value' },
    { qty: 500, label: '500 units', badge: 'Save 35%' },
  ];

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#EA580C]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900">
            Print Specifications
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Bleed: {product.bleed_mm || 3}mm • {product.dpi || 300} DPI
        </span>
      </div>

      {/* Dimensions (mm) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <label className="text-zinc-700 font-bold">Finished Trim Size (mm)</label>
          <span className="text-zinc-400">
            Min: {product.min_width_mm}×{product.min_height_mm} | Max: {product.max_width_mm}×{product.max_height_mm}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Width</span>
            <div className="relative mt-1">
              <input
                type="number"
                min={product.min_width_mm}
                max={product.max_width_mm}
                value={config.width_mm}
                onChange={(e) => onConfigChange({ width_mm: Number(e.target.value) })}
                className="w-full text-xs font-mono h-9 px-3 pr-8 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400">
                mm
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Height</span>
            <div className="relative mt-1">
              <input
                type="number"
                min={product.min_height_mm}
                max={product.max_height_mm}
                value={config.height_mm}
                onChange={(e) => onConfigChange({ height_mm: Number(e.target.value) })}
                className="w-full text-xs font-mono h-9 px-3 pr-8 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400">
                mm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Material Selection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-mono font-bold text-zinc-700">Substrate / Material</label>
        <select
          value={config.material_id}
          onChange={(e) => onConfigChange({ material_id: e.target.value })}
          className="w-full text-xs font-mono h-9 px-3 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C] bg-white"
        >
          {product.materials_json?.map((mat) => (
            <option key={mat.id} value={mat.id}>
              {mat.name} {mat.multiplier > 1 ? `(+${Math.round((mat.multiplier - 1) * 100)}%)` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity Presets (Decoy Effect) */}
      <div className="space-y-2">
        <label className="block text-xs font-mono font-bold text-zinc-700">Production Volume</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quantityPills.map((pill) => (
            <button
              key={pill.qty}
              type="button"
              onClick={() => onQuantityChange(pill.qty)}
              className={`p-2 rounded border text-center transition-all relative ${
                quantity === pill.qty
                  ? 'border-[#EA580C] bg-orange-50/50 text-[#EA580C] font-bold shadow-xs'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
              }`}
            >
              {pill.badge && (
                <span className="absolute -top-2 right-1 px-1.5 py-0.2 bg-[#EA580C] text-white rounded text-[9px] font-mono font-bold">
                  {pill.badge}
                </span>
              )}
              <span className="text-xs font-mono block">{pill.qty}</span>
            </button>
          ))}
        </div>

        {/* Custom Quantity Input */}
        <div className="pt-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">Or specify exact count</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value)))}
            className="w-full text-xs font-mono h-9 px-3 mt-1 rounded border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
          />
        </div>
      </div>
    </Card>
  );
};

