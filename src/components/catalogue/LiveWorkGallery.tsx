'use client';

/**
-- ==============================================================================
-- LIVE WORK GALLERY COMPONENT (CATALOGUE LAYER)
-- Real print samples with division filter tabs
-- ==============================================================================
*/

import React, { useState } from 'react';
import { GalleryItem, ProductDivision } from '../../types';
import { Card } from '../ui/Card';
import Image from 'next/image';

interface LiveWorkGalleryProps {
  items: GalleryItem[];
  divisions: ProductDivision[];
  onSelectDivision: (divisionSlug?: string) => void;
}

export const LiveWorkGallery: React.FC<LiveWorkGalleryProps> = ({
  items,
  divisions,
  onSelectDivision,
}) => {
  const [selectedDiv, setSelectedDiv] = useState<string>('all');

  const handleTabClick = (slug: string) => {
    setSelectedDiv(slug);
    onSelectDivision(slug === 'all' ? undefined : slug);
  };

  return (
    <div id="gallery" className="w-full">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-zinc-200">
        <button
          onClick={() => handleTabClick('all')}
          className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-colors whitespace-nowrap ${
            selectedDiv === 'all'
              ? 'bg-[#18181B] text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          All Portfolio Work
        </button>
        {divisions.map((div) => (
          <button
            key={div.id}
            onClick={() => handleTabClick(div.slug)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-colors whitespace-nowrap ${
              selectedDiv === div.slug
                ? 'bg-[#18181B] text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {div.name}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      {items.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono text-zinc-400">
          No live print samples available for this division.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} padding="none" hoverEffect className="overflow-hidden group">
              <div className="relative aspect-4/3 w-full bg-zinc-100 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h4 className="font-bold text-sm text-zinc-900 tracking-tight">{item.title}</h4>
                <div className="mt-2 text-xs font-mono text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-200/60 leading-relaxed">
                  {item.specs_label}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

