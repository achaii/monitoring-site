import React from 'react';

export interface RawInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
}

export function RawInput({
  label,
  helperText,
  error = false,
  className = '',
  disabled,
  ...props
}: RawInputProps) {
  const borderClass = error
    ? "border-[#FF0000] border-[3px]"
    : disabled
    ? "border-[#CCCCCC] border-[3px] bg-[#F5F5F5] cursor-not-allowed"
    : "border-black border-[3px] bg-[#F0F0F0] hover:bg-[#E8E8E8] focus:border-[5px] focus:outline-none";

  return (
    <div className="w-full">
      {label && (
        <label className="block font-headline text-xs uppercase tracking-wider text-black mb-1">
          {label}
        </label>
      )}
      <input
        disabled={disabled}
        className={`w-full font-mono text-sm px-3 py-2 text-black transition-none ${borderClass} ${className}`}
        {...props}
      />
      {helperText && (
        <span
          className={`block text-xs mt-1 font-body ${
            error ? 'text-[#FF0000] font-bold' : 'text-[#666666]'
          }`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}
