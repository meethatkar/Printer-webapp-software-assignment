'use client';

/**
-- ==============================================================================
-- FINISHED ARTWORK UPLOADER COMPONENT (DESIGNER LAYER)
-- Uploads .pdf, .svg, .ai, .png with file preview & validation
-- ==============================================================================
*/

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { UploadCloud, FileCheck, AlertCircle } from 'lucide-react';

interface ArtworkUploaderProps {
  onFileUpload: (file: File) => Promise<string | null>;
  currentFileUrl?: string | null;
  currentFileName?: string | null;
}

export const ArtworkUploader: React.FC<ArtworkUploaderProps> = ({
  onFileUpload,
  currentFileUrl,
  currentFileName,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const validExtensions = ['.pdf', '.svg', '.ai', '.png', '.jpg', '.jpeg'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setErrorMsg('Invalid format. Supported: .pdf, .svg, .ai, .png, .jpg');
      return;
    }

    setErrorMsg(null);
    setUploading(true);
    try {
      await onFileUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900">
          Upload Finished Artwork File
        </h3>
        <span className="text-[11px] font-mono text-zinc-400">PDF / SVG / AI / High-Res PNG</span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? 'border-[#EA580C] bg-orange-50/50'
            : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50/50'
        }`}
      >
        <UploadCloud className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
        <p className="text-xs text-zinc-700 font-medium">
          Drag & drop finished print file here, or{' '}
          <label className="text-[#EA580C] hover:underline cursor-pointer">
            browse from device
            <input
              type="file"
              accept=".pdf,.svg,.ai,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </p>
        <p className="text-[10px] font-mono text-zinc-400 mt-2">
          Recommended: CMYK, 300 DPI, 3mm Bleed Included (Up to 50MB)
        </p>
      </div>

      {uploading && (
        <div className="text-xs font-mono text-zinc-500 flex items-center justify-center gap-2 py-2">
          <div className="w-3.5 h-3.5 border-2 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
          <span>Validating & uploading prepress file...</span>
        </div>
      )}

      {errorMsg && (
        <div className="text-xs font-mono text-red-600 bg-red-50 p-2.5 rounded border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {currentFileUrl && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between text-xs font-mono text-emerald-800">
          <div className="flex items-center gap-2 truncate">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{currentFileName || 'Finished Artwork Loaded'}</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">
            Attached
          </span>
        </div>
      )}
    </Card>
  );
};

