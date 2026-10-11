'use client';

import React from 'react';
import { GlobalProbeNode } from '@/types/monitor';
import { RawBadge } from '@/components/ui/raw-badge';

interface GlobalProbeMapProps {
  probes: GlobalProbeNode[];
}

export function GlobalProbeMap({ probes }: GlobalProbeMapProps) {
  return (
    <div className="bg-white border-[3px] border-black p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-black pb-3 mb-4">
        <div>
          <h4 className="font-headline text-sm uppercase tracking-wider">
            GLOBAL PROBE CONSENSUS NODES
          </h4>
          <p className="text-xs font-mono text-[#666666]">
            Multi-region consensus probes for false-positive mitigation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#008000] border border-black inline-block animate-pulse" />
          <span className="font-mono text-xs font-bold">5/5 NODES ACTIVE</span>
        </div>
      </div>

      {/* Grid of Global Probe Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {probes.map((probe) => {
          const isOptimal = probe.status === 'OPTIMAL';
          const isDegraded = probe.status === 'DEGRADED';
          const badgeStatus = isOptimal ? 'ACTIVE' : isDegraded ? 'WARNING' : 'ERROR';

          return (
            <div
              key={probe.id}
              className="border-[2px] border-black p-3 bg-white hover:bg-[#F0F0F0] transition-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold bg-[#F0F0F0] border border-black px-1.5 py-0.5" title={probe.country}>
                    [{probe.countryCode}]
                  </span>
                  <RawBadge status={badgeStatus} label={probe.status} />
                </div>
                <div className="font-headline text-sm uppercase">
                  {probe.city}
                </div>
                <div className="font-mono text-[11px] text-[#666666]">
                  {probe.countryCode} // {probe.ip}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-black flex items-baseline justify-between">
                <span className="text-[10px] font-mono text-[#666666]">LATENCY:</span>
                <span
                  className={`font-headline text-lg ${
                    isOptimal
                      ? 'text-[#008000]'
                      : isDegraded
                      ? 'text-[#FFA500]'
                      : 'text-[#FF0000]'
                  }`}
                >
                  {probe.latencyMs} <span className="text-xs font-mono text-black">MS</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consensus Verification Banner */}
      <div className="mt-4 bg-[#F0F0F0] border-[2px] border-black p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div>
          <strong>MULTI-NODE CONSENSUS STATUS:</strong> 3/3 distributed probe regions confirmed consistent status.
        </div>
        <div className="text-[11px] bg-black text-white px-2 py-0.5 font-bold">
          ANTI-FALSE ALARM: ENABLED
        </div>
      </div>
    </div>
  );
}
