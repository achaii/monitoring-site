'use client';

import React from 'react';

export function StatusCodeDistribution() {
  const distribution = [
    { code: '2xx Success', count: '99.4%', color: 'bg-[#008000]', text: 'text-[#008000]' },
    { code: '3xx Redirect', count: '0.3%', color: 'bg-[#0000FF]', text: 'text-[#0000FF]' },
    { code: '4xx Client Err', count: '0.2%', color: 'bg-[#FFA500]', text: 'text-[#FFA500]' },
    { code: '5xx Server Err', count: '0.1%', color: 'bg-[#FF0000]', text: 'text-[#FF0000]' },
  ];

  return (
    <div className="bg-white border-[3px] border-black p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b-[2px] border-black pb-2 mb-3">
        <h4 className="font-headline text-xs uppercase tracking-wider">
          HTTP STATUS DISTRIBUTION
        </h4>
        <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5">
          LAST 30 DAYS
        </span>
      </div>

      {/* Visual Proportional Bar */}
      <div className="my-2">
        <div className="w-full h-5 bg-[#F0F0F0] border-[2px] border-black flex overflow-hidden">
          <div style={{ width: '99.4%' }} className="bg-[#008000] h-full" title="2xx: 99.4%" />
          <div style={{ width: '0.3%' }} className="bg-[#0000FF] h-full" title="3xx: 0.3%" />
          <div style={{ width: '0.2%' }} className="bg-[#FFA500] h-full" title="4xx: 0.2%" />
          <div style={{ width: '0.1%' }} className="bg-[#FF0000] h-full" title="5xx: 0.1%" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-black text-xs font-mono">
        {distribution.map((d, idx) => (
          <div key={idx} className="flex items-center justify-between p-1 bg-[#F0F0F0] border border-black">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 ${d.color} border border-black inline-block`} />
              <span className="text-[11px]">{d.code}</span>
            </div>
            <strong className="font-bold">{d.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
