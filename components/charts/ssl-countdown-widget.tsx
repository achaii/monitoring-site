'use client';

import React from 'react';
import { SslInfo } from '@/types/monitor';
import { RawBadge } from '@/components/ui/raw-badge';

interface SslCountdownWidgetProps {
  ssl: SslInfo;
}

export function SslCountdownWidget({ ssl }: SslCountdownWidgetProps) {
  const { valid, issuer, daysRemaining, tlsVersion, cipherSuite, validTo, subjectAltNames } = ssl;

  let statusBadge: 'ACTIVE' | 'WARNING' | 'ERROR' = 'ACTIVE';
  let statusText = 'VALID & TRUSTED';

  if (!valid || daysRemaining === 0) {
    statusBadge = 'ERROR';
    statusText = 'EXPIRED / INVALID';
  } else if (daysRemaining <= 14) {
    statusBadge = 'ERROR';
    statusText = 'CRITICAL (<14 DAYS)';
  } else if (daysRemaining <= 30) {
    statusBadge = 'WARNING';
    statusText = 'EXPIRING SOON';
  }

  return (
    <div className="bg-white border-[3px] border-black p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b-[2px] border-black pb-2 mb-3">
        <h4 className="font-headline text-xs uppercase tracking-wider">
          SSL/TLS CERTIFICATE HEALTH
        </h4>
        <RawBadge status={statusBadge} label={statusText} />
      </div>

      <div className="my-2">
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className={`font-headline text-3xl ${
              daysRemaining > 30
                ? 'text-[#008000]'
                : daysRemaining > 14
                ? 'text-[#FFA500]'
                : 'text-[#FF0000]'
            }`}
          >
            {daysRemaining}
          </span>
          <span className="font-headline text-sm uppercase">DAYS REMAINING</span>
        </div>

        <div className="bg-[#F0F0F0] border-[2px] border-black p-2 text-xs font-mono space-y-1">
          <div className="flex justify-between">
            <span className="text-[#666666]">ISSUER:</span>
            <span className="font-bold truncate max-w-[180px]" title={issuer}>
              {issuer}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">PROTOCOL:</span>
            <span className="font-bold bg-black text-white px-1.5 py-0.2">
              {tlsVersion}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">EXPIRES:</span>
            <span>{validTo ? validTo.split('T')[0] : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-[#666666] border-t border-black pt-2 mt-2 truncate">
        CIPHER: {cipherSuite}
      </div>
    </div>
  );
}
