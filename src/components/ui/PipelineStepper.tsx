'use client';

/**
-- ==============================================================================
-- 6-STEP HORIZONTAL PIPELINE TRACKER (GOAL-GRADIENT EFFECT)
-- QUOTE -> ORDER -> ARTWORK -> PROOF -> PRODUCTION -> COMPLETED
-- ==============================================================================
*/

import React from 'react';
import { PipelineStatus } from '../../types';

const STAGES: PipelineStatus[] = ['QUOTE', 'ORDER', 'ARTWORK', 'PROOF', 'PRODUCTION', 'COMPLETED'];

export const PipelineStepper: React.FC<{ currentStatus: PipelineStatus }> = ({ currentStatus }) => {
  const currentIndex = STAGES.indexOf(currentStatus);

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-zinc-200 -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#EA580C] transition-all duration-500 -z-0"
          style={{ width: `${(Math.max(0, currentIndex) / (STAGES.length - 1)) * 100}%` }}
        />

        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage} className="flex flex-col items-center relative z-10">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                  isDone
                    ? 'bg-[#EA580C] text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-[#EA580C] text-[#EA580C] ring-4 ring-orange-100'
                    : 'bg-white border border-zinc-300 text-zinc-400'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span
                className={`text-[10px] font-mono tracking-tight mt-1 hidden sm:block ${
                  isCurrent ? 'font-bold text-zinc-900' : 'text-zinc-500'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

