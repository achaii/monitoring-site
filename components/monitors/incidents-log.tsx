'use client';

import React from 'react';
import { Incident } from '@/types/monitor';
import { RawBadge } from '@/components/ui/raw-badge';

interface IncidentsLogProps {
  incidents: Incident[];
}

export function IncidentsLog({ incidents }: IncidentsLogProps) {
  return (
    <div className="bg-white border-[3px] border-black p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-[2px] border-black pb-3 mb-4">
        <div>
          <h4 className="font-headline text-sm uppercase tracking-wider">
            INCIDENT HISTORY & RESOLUTION METRICS
          </h4>
          <p className="text-xs font-mono text-[#666666]">
            Incident resolution history and system reliability metrics
          </p>
        </div>

        {/* Reliability KPI Cards */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-[#F0F0F0] border-[2px] border-black px-3 py-1">
            <span className="text-[#666666] mr-1">MTTR:</span>
            <strong>18m 22s</strong>
          </div>
          <div className="bg-[#F0F0F0] border-[2px] border-black px-3 py-1">
            <span className="text-[#666666] mr-1">MTBF:</span>
            <strong>28 Days</strong>
          </div>
          <div className="bg-[#F0F0F0] border-[2px] border-black px-3 py-1">
            <span className="text-[#666666] mr-1">TOTAL DOWNTIME:</span>
            <strong>1h 48m</strong>
          </div>
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="text-center py-8 font-mono text-xs text-[#008000] border-[2px] border-black bg-[#F0F0F0]">
          NO ACTIVE INCIDENTS IN THE LAST 30 DAYS. ALL SYSTEMS 100% OPERATIONAL.
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((inc) => {
            const isResolved = inc.status === 'RESOLVED';
            const badgeType = isResolved
              ? 'ACTIVE'
              : inc.severity === 'CRITICAL'
              ? 'ERROR'
              : 'WARNING';

            return (
              <div
                key={inc.id}
                className="border-[2px] border-black p-4 bg-white hover:bg-[#F0F0F0] transition-none"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <RawBadge status={badgeType} label={inc.status} />
                    <span className="font-headline text-sm uppercase">
                      {inc.title}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#666666]">
                    DURATION: <strong>{inc.durationFormatted}</strong>
                  </div>
                </div>

                <p className="font-body text-xs text-[#333333] mb-2">
                  <strong>Root Cause:</strong> {inc.rootCause}
                </p>

                <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#666666] pt-2 border-t border-black">
                  <span>TRIGGERED: {inc.startedAt.replace('T', ' ').replace('Z', ' UTC')}</span>
                  <span>
                    AFFECTED REGIONS: {inc.affectedRegions.join(', ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
