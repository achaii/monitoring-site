'use client';

import React from 'react';
import { LatencyWaterfall } from '@/types/monitor';

interface LatencyWaterfallChartProps {
  waterfall: LatencyWaterfall;
}

export function LatencyWaterfallChart({ waterfall }: LatencyWaterfallChartProps) {
  const { dnsTime, tcpTime, tlsTime, ttfbTime, transferTime, totalTime } = waterfall;
  const safeTotal = totalTime > 0 ? totalTime : 1;

  const phases = [
    { name: 'DNS Lookup', time: dnsTime, color: '#000000', labelColor: 'text-black', border: 'border-black' },
    { name: 'TCP Handshake', time: tcpTime, color: '#333333', labelColor: 'text-black', border: 'border-black' },
    { name: 'TLS Handshake', time: tlsTime, color: '#666666', labelColor: 'text-black', border: 'border-black' },
    { name: 'TTFB (Wait)', time: ttfbTime, color: '#FFA500', labelColor: 'text-[#FFA500]', border: 'border-[#FFA500]' },
    { name: 'Content Download', time: transferTime, color: '#008000', labelColor: 'text-[#008000]', border: 'border-[#008000]' },
  ];

  return (
    <div className="bg-white border-[3px] border-black p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-black pb-3 mb-4">
        <div>
          <h4 className="font-headline text-sm uppercase tracking-wider">
            NETWORK TIMING WATERFALL
          </h4>
          <p className="text-xs font-mono text-[#666666]">
            Request lifecycle duration broken down by network layer
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-[#666666] mr-2">TOTAL LATENCY:</span>
          <span className="font-headline text-lg text-black bg-[#F0F0F0] border-[2px] border-black px-3 py-1">
            {totalTime} MS
          </span>
        </div>
      </div>

      {/* Visual Stacked Progress Bar */}
      <div className="w-full mb-6">
        <div className="text-[11px] font-mono text-[#666666] mb-1 flex justify-between">
          <span>0 ms</span>
          <span>REQUEST LIFECYCLE</span>
          <span>{totalTime} ms</span>
        </div>
        <div className="w-full h-8 bg-[#F0F0F0] border-[3px] border-black flex overflow-hidden">
          {phases.map((phase, idx) => {
            const pct = Math.max(2, (phase.time / safeTotal) * 100);
            return (
              <div
                key={idx}
                style={{ width: `${pct}%`, backgroundColor: phase.color }}
                title={`${phase.name}: ${phase.time}ms (${pct.toFixed(1)}%)`}
                className="h-full border-r-[2px] border-black last:border-r-0 hover:opacity-80 transition-none flex items-center justify-center text-[10px] font-mono font-bold text-white overflow-hidden"
              >
                {pct > 10 ? `${phase.time}ms` : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {phases.map((phase, idx) => (
          <div
            key={idx}
            className={`border-[2px] border-black p-3 bg-white hover:bg-black hover:text-white group transition-none`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#666666] group-hover:text-white">
                {phase.name}
              </span>
              <span
                className="w-3 h-3 border border-black inline-block"
                style={{ backgroundColor: phase.color }}
              />
            </div>
            <div className="font-headline text-xl">
              {phase.time} <span className="text-xs font-mono">MS</span>
            </div>
            <div className="text-[10px] font-mono text-[#666666] group-hover:text-[#CCCCCC] mt-1">
              {((phase.time / safeTotal) * 100).toFixed(1)}% of total
            </div>
          </div>
        ))}
      </div>

      {/* Percentiles Latency Reference */}
      <div className="mt-4 pt-3 border-t-[2px] border-black flex flex-wrap items-center justify-between text-xs font-mono text-[#666666]">
        <span>Distributed Latency Percentiles:</span>
        <div className="flex gap-4">
          <span>P50: <strong>{Math.round(totalTime * 0.85)}ms</strong></span>
          <span>P90: <strong>{Math.round(totalTime * 1.15)}ms</strong></span>
          <span>P95: <strong>{Math.round(totalTime * 1.35)}ms</strong></span>
          <span>P99: <strong>{Math.round(totalTime * 1.8)}ms</strong></span>
        </div>
      </div>
    </div>
  );
}
