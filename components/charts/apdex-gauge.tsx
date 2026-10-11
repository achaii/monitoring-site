'use client';

import React from 'react';

interface ApdexGaugeProps {
  score: number; // 0.00 to 1.00
  targetMs?: number;
}

export function ApdexGauge({ score, targetMs = 300 }: ApdexGaugeProps) {
  let label = 'EXCELLENT';
  let badgeBg = 'bg-[#008000] text-white';

  if (score >= 0.94) {
    label = 'EXCELLENT';
    badgeBg = 'bg-[#008000] text-white';
  } else if (score >= 0.85) {
    label = 'GOOD';
    badgeBg = 'bg-[#008000] text-white';
  } else if (score >= 0.70) {
    label = 'FAIR';
    badgeBg = 'bg-[#FFA500] text-black';
  } else {
    label = 'POOR';
    badgeBg = 'bg-[#FF0000] text-white';
  }

  const percentage = Math.min(100, Math.max(0, Math.round(score * 100)));

  return (
    <div className="bg-white border-[3px] border-black p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b-[2px] border-black pb-2 mb-3">
        <h4 className="font-headline text-xs uppercase tracking-wider">
          APDEX USER EXPERIENCE
        </h4>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border border-black ${badgeBg}`}>
          {label}
        </span>
      </div>

      <div className="my-2">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-headline text-3xl">
            {score.toFixed(2)}
          </span>
          <span className="text-xs font-mono text-[#666666]">
            TARGET (T): {targetMs}MS
          </span>
        </div>

        {/* Visual Brutalist Gauge Bar */}
        <div className="w-full h-5 bg-[#F0F0F0] border-[2px] border-black p-[2px]">
          <div
            style={{ width: `${percentage}%` }}
            className={`h-full border border-black ${
              score >= 0.85 ? 'bg-[#008000]' : score >= 0.7 ? 'bg-[#FFA500]' : 'bg-[#FF0000]'
            }`}
          />
        </div>

        <div className="flex justify-between text-[10px] font-mono text-[#666666] mt-1">
          <span>0.00 (Poor)</span>
          <span>0.70</span>
          <span>0.85</span>
          <span>1.00 (Perfect)</span>
        </div>
      </div>

      <div className="text-[11px] font-mono text-[#666666] border-t border-black pt-2 mt-2">
        Application Performance Index measuring user satisfaction based on response latency.
      </div>
    </div>
  );
}
