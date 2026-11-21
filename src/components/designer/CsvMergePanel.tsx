'use client';

/**
-- ==============================================================================
-- CSV VARIABLE DATA PANEL COMPONENT (DESIGNER LAYER)
-- Upload CSV, parse rows, display parsed row count, preview row 1 live
-- ==============================================================================
*/

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Table, FileSpreadsheet, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface CsvMergePanelProps {
  onParseCsv: (csvText: string) => Promise<any>;
  csvHeaders: string[];
  csvRows: Record<string, string>[];
  activeCsvRowIndex: number;
  onSelectRowIndex: (idx: number) => void;
}

export const CsvMergePanel: React.FC<CsvMergePanelProps> = ({
  onParseCsv,
  csvHeaders,
  csvRows,
  activeCsvRowIndex,
  onSelectRowIndex,
}) => {
  const [parsing, setParsing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (text) {
        await onParseCsv(text);
      }
      setParsing(false);
    };
    reader.readAsText(file);
  };

  const loadSampleCsv = async () => {
    const sample = `Full_Name,Job_Title,Badge_Number\nSarah Connor,Security Director,SEC-001\nJohn Reese,Operations Officer,OPS-002\nHarold Finch,Chief Engineer,ENG-003`;
    setParsing(true);
    await onParseCsv(sample);
    setParsing(false);
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#EA580C]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900">
            Variable Data Printing (VDP Merge)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          {csvRows.length > 0 ? `${csvRows.length} Records Loaded` : 'No CSV loaded'}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <label className="inline-flex items-center gap-1.5 h-9 px-3 rounded bg-zinc-900 text-white text-xs font-mono font-medium hover:bg-zinc-800 cursor-pointer transition-colors">
          <span>Upload CSV File</span>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </label>

        <button
          type="button"
          onClick={loadSampleCsv}
          className="text-xs font-mono text-[#EA580C] hover:underline"
        >
          Load Sample Names CSV
        </button>
      </div>

      {parsing && (
        <div className="text-xs font-mono text-zinc-500 py-2">
          Parsing CSV and validating variable fields...
        </div>
      )}

      {csvRows.length > 0 && (
        <div className="space-y-3 pt-2">
          {/* Record Pager */}
          <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded border border-zinc-200 text-xs font-mono">
            <span className="text-zinc-600">
              Previewing Record: <strong>{activeCsvRowIndex + 1}</strong> of {csvRows.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={activeCsvRowIndex === 0}
                onClick={() => onSelectRowIndex(Math.max(0, activeCsvRowIndex - 1))}
                className="p-1 rounded hover:bg-zinc-200 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={activeCsvRowIndex === csvRows.length - 1}
                onClick={() => onSelectRowIndex(Math.min(csvRows.length - 1, activeCsvRowIndex + 1))}
                className="p-1 rounded hover:bg-zinc-200 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Record 1 / Active Row Preview */}
          <div className="text-xs font-mono bg-white rounded border border-zinc-200 p-3 overflow-x-auto">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">
              Mapped Variables (Auto-Clamped inside Safe Zone):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {csvHeaders.map((header) => (
                <div key={header} className="bg-zinc-50 p-1.5 rounded border border-zinc-100">
                  <div className="text-[9px] text-zinc-400 font-bold">{header}</div>
                  <div className="text-zinc-900 truncate font-semibold">
                    {csvRows[activeCsvRowIndex]?.[header] || '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

