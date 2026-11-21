'use client';

/**
-- ==============================================================================
-- CONSTRAINED IN-BROWSER CANVAS COMPONENT (DESIGNER LAYER)
-- Proportional visual stage showing:
-- - Red dashed Bleed Zone (+3mm)
-- - Blue dashed Safe Print Area (-3mm inside trim)
-- - Real-time element selection, repositioning, and proof preview toggle
-- ==============================================================================
*/

import React, { useRef } from 'react';
import { CanvasElement, DesignConfig } from '../../types';

interface ConstrainedCanvasProps {
  config: DesignConfig;
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElementPosition: (id: string, x: number, y: number) => void;
  previewProof: boolean;
  activeCsvRow?: Record<string, string>;
}

export const ConstrainedCanvas: React.FC<ConstrainedCanvasProps> = ({
  config,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElementPosition,
  previewProof,
  activeCsvRow,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Aspect ratio calculation
  const widthMm = config.width_mm || 85;
  const heightMm = config.height_mm || 55;
  const aspectRatio = widthMm / heightMm;

  const isPortrait = config.orientation === 'portrait';
  const effectiveW = isPortrait ? Math.min(widthMm, heightMm) : Math.max(widthMm, heightMm);
  const effectiveH = isPortrait ? Math.max(widthMm, heightMm) : Math.min(widthMm, heightMm);

  // Scale factor for display
  const scale = Math.min(420 / effectiveW, 300 / effectiveH);
  const canvasPixelW = Math.round(effectiveW * scale);
  const canvasPixelH = Math.round(effectiveH * scale);

  const handleElementMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    onSelectElement(el.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const originalElX = el.x;
    const originalElY = el.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;

      // Strict clamping inside printable safe zone
      const safePadding = 4; // 4mm inside trim
      const clampedX = Math.max(safePadding, Math.min(effectiveW - safePadding - 10, originalElX + deltaX));
      const clampedY = Math.max(safePadding, Math.min(effectiveH - safePadding - 10, originalElY + deltaY));

      onUpdateElementPosition(el.id, Math.round(clampedX), Math.round(clampedY));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      onClick={() => onSelectElement(null)}
      className="w-full bg-zinc-100/80 rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[360px] border border-zinc-200 overflow-hidden relative select-none"
    >
      {/* Outer Bleed Container (Red Dashed) */}
      <div
        className={`relative transition-all duration-300 shadow-md ${
          previewProof ? 'border border-zinc-300 bg-white' : 'border-2 border-dashed border-red-500/80 bg-white'
        }`}
        style={{
          width: `${canvasPixelW}px`,
          height: `${canvasPixelH}px`,
        }}
      >
        {/* Inner Safe Print Area (Blue Dashed) */}
        {!previewProof && (
          <div className="absolute inset-2 sm:inset-3 border border-dashed border-blue-500/60 pointer-events-none z-10 flex items-start justify-end p-1">
            <span className="text-[8px] font-mono font-bold text-blue-500/80 uppercase">Safe Zone</span>
          </div>
        )}

        {/* Render Canvas Elements */}
        {elements.map((el) => {
          let displayText = el.text || '';
          if (el.vdpColumn && activeCsvRow && activeCsvRow[el.vdpColumn]) {
            displayText = activeCsvRow[el.vdpColumn];
          }

          const isSelected = selectedElementId === el.id && !previewProof;

          return (
            <div
              key={el.id}
              onMouseDown={(e) => handleElementMouseDown(e, el)}
              className={`absolute cursor-move transition-shadow z-20 ${
                isSelected
                  ? 'ring-2 ring-[#EA580C] ring-offset-1 rounded-xs bg-orange-50/20'
                  : 'hover:ring-1 hover:ring-zinc-400'
              }`}
              style={{
                left: `${el.x * scale}px`,
                top: `${el.y * scale}px`,
                transform: `rotate(${el.rotation || 0}deg)`,
              }}
            >
              <span
                style={{
                  fontSize: `${(el.fontSize || 14) * (scale / 2.83)}px`,
                  fontFamily: el.fontFamily || 'Inter',
                  color: el.fill || '#18181B',
                  whiteSpace: 'nowrap',
                }}
                className="font-medium"
              >
                {displayText}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend & Prepress Guide */}
      <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 mt-6">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-red-500 inline-block" /> 3mm Bleed Line
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-500 inline-block" /> Safe Print Area
        </span>
        <span>
          Trim: {effectiveW}×{effectiveH}mm
        </span>
      </div>
    </div>
  );
};

