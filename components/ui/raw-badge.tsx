import React from 'react';

export type BadgeStatus = 'ACTIVE' | 'WARNING' | 'ERROR' | 'DEFAULT';

export function RawBadge({
  status = 'DEFAULT',
  label,
  className = '',
}: {
  status?: BadgeStatus;
  label: string;
  className?: string;
}) {
  const styles = {
    ACTIVE: "bg-white text-[#008000] border-[#008000]",
    WARNING: "bg-white text-[#FFA500] border-[#FFA500]",
    ERROR: "bg-white text-[#FF0000] border-[#FF0000]",
    DEFAULT: "bg-white text-black border-black",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider border-[2px] ${styles[status]} ${className}`}
    >
      {label}
    </span>
  );
}
