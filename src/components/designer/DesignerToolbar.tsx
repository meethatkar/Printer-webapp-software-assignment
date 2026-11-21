'use client';

/**
-- ==============================================================================
-- DESIGNER TOOLBAR COMPONENT (DESIGNER LAYER)
-- Add/edit text, font selection, size, fill, delete, and proof preview toggle
-- ==============================================================================
*/

import React from 'react';
import { CanvasElement } from '../../types';
import { Type, Trash2, Eye, EyeOff, RotateCw, Palette } from 'lucide-react';

interface DesignerToolbarProps {
  selectedElement: CanvasElement | null;
  onAddText: () => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  previewProof: boolean;
  onTogglePreview: () => void;
}

export const DesignerToolbar: React.FC<DesignerToolbarProps> = ({
  selectedElement,
  onAddText,
  onUpdateElement,
  onDeleteElement,
  previewProof,
  onTogglePreview,
}) => {
  return (
    <div className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Add Text Element */}
        <button
          type="button"
          onClick={onAddText}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold transition-colors"
        >
          <Type className="w-3.5 h-3.5 text-[#EA580C]" />
          <span>Add Text</span>
        </button>

        {selectedElement && (
          <>
            <div className="h-4 w-px bg-zinc-200 mx-1" />

            {/* Edit Text Content */}
            <input
              type="text"
              value={selectedElement.text || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { text: e.target.value })}
              className="h-8 px-2.5 rounded border border-zinc-300 text-xs w-36 sm:w-48 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              placeholder="Text content..."
            />

            {/* Font Size */}
            <div className="flex items-center gap-1">
              <span className="text-zinc-400">Pt:</span>
              <input
                type="number"
                min={6}
                max={72}
                value={selectedElement.fontSize || 12}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, { fontSize: Math.max(6, Number(e.target.value)) })
                }
                className="h-8 w-14 px-1.5 rounded border border-zinc-300 text-xs text-center focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
              />
            </div>

            {/* Color Picker */}
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={selectedElement.fill || '#18181B'}
                onChange={(e) => onUpdateElement(selectedElement.id, { fill: e.target.value })}
                className="w-7 h-8 p-0 rounded border border-zinc-300 cursor-pointer"
                title="Font Color"
              />
            </div>

            {/* Delete Element */}
            <button
              type="button"
              onClick={() => onDeleteElement(selectedElement.id)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete Element"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Real-time Proof Preview Toggle */}
      <div>
        <button
          type="button"
          onClick={onTogglePreview}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition-colors ${
            previewProof
              ? 'bg-[#18181B] text-white'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
          }`}
        >
          {previewProof ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{previewProof ? 'Exit Proof' : 'Proof Preview'}</span>
        </button>
      </div>
    </div>
  );
};

