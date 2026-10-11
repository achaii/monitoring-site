'use client';

import React, { useState } from 'react';
import { DayUptime } from '@/types/monitor';

interface UptimeHistoryBarProps {
  days: DayUptime[];
  uptime90d: number;
  uptime30d: number;
  uptime24h: number;
}

export function UptimeHistoryBar({
  days,
  uptime90d,
  uptime30d,
  uptime24h,
}: UptimeHistoryBarProps) {
  const [hoveredDay, setHoveredDay] = useState<DayUptime | null>(null);

  const getBarColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'bg-[#008000]';
      case 'degraded':
        return 'bg-[#FFA500]';
      case 'down':
        return 'bg-[#FF0000]';
      default:
        return 'bg-[#CCCCCC]';
    }
  };

  return (
    <div className="w-full bg-white border-[3px] border-black p-4">
      {/* Header bar with SLA metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b-[2px] border-black pb-2">
        <div className="flex items-center gap-2">
          <span className="font-headline uppercase text-xs tracking-wider">
            90-DAY UPTIME TIMELINE
          </span>
          <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5">
            SLA HISTORY
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-[#666666] mr-1">24H:</span>
            <span className="font-bold">{uptime24h.toFixed(2)}%</span>
          </div>
          <div className="border-l-[2px] border-black pl-3">
            <span className="text-[#666666] mr-1">30D:</span>
            <span className="font-bold">{uptime30d.toFixed(2)}%</span>
          </div>
          <div className="border-l-[2px] border-black pl-3">
            <span className="text-[#666666] mr-1">90D:</span>
            <span className="font-bold text-[#008000]">{uptime90d.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* 90-Segment Bar Grid */}
      <div
        className="grid grid-cols-[repeat(90,minmax(0,1fr))] gap-[2px] h-9 bg-black p-[2px] border-[2px] border-black cursor-crosshair"
        onMouseLeave={() => setHoveredDay(null)}
      >
        {days.map((day, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredDay(day)}
            className={`${getBarColor(
              day.status
            )} hover:brightness-125 transition-none h-full`}
          />
        ))}
      </div>

      {/* Bar Legend & Tooltip detail */}
      <div className="flex flex-wrap items-center justify-between mt-3 text-xs font-mono min-h-[28px]">
        {hoveredDay ? (
          <div className="bg-black text-white px-3 py-1 border-[2px] border-black flex items-center gap-3">
            <span className="font-bold text-[#FFFFFF]">{hoveredDay.date}</span>
            <span className="border-l border-white pl-2">
              UPTIME: <strong>{hoveredDay.uptimePercentage}%</strong>
            </span>
            <span className="border-l border-white pl-2">
              STATUS:{' '}
              <strong
                className={
                  hoveredDay.status === 'up'
                    ? 'text-[#00FF00]'
                    : hoveredDay.status === 'degraded'
                    ? 'text-[#FFA500]'
                    : 'text-[#FF5555]'
                }
              >
                {hoveredDay.status.toUpperCase()}
              </strong>
            </span>
            {hoveredDay.downtimeMinutes > 0 && (
              <span className="border-l border-white pl-2 text-[#FF5555]">
                DOWNTIME: {hoveredDay.downtimeMinutes}m
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 text-[#666666]">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#008000] border border-black inline-block" />
            <span>100% Up</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#FFA500] border border-black inline-block" />
            <span>Degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#FF0000] border border-black inline-block" />
            <span>Down</span>
          </div>
        </div>
      </div>
    </div>
  );
}
