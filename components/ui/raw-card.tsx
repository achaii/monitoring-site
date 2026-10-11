import React from 'react';

export function RawCard({
  children,
  elevated = false,
  inverted = false,
  className = '',
}: {
  children: React.ReactNode;
  elevated?: boolean;
  inverted?: boolean;
  className?: string;
}) {
  const border = elevated ? 'border-[5px] border-black' : 'border-[3px] border-black';
  const colors = inverted ? 'bg-black text-white' : 'bg-white text-black';

  return (
    <div className={`p-6 ${border} ${colors} ${className}`}>
      {children}
    </div>
  );
}
