import React from 'react';

export interface RawButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export function RawButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: RawButtonProps) {
  const base =
    "font-headline uppercase tracking-wider inline-flex items-center justify-center transition-none cursor-pointer border-solid select-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs border-[2px]",
    md: "px-5 py-2.5 text-sm border-[3px]",
    lg: "px-8 py-3.5 text-base border-[3px]",
  };

  const variantClasses = {
    primary:
      "bg-black text-white border-black hover:bg-white hover:text-black active:border-[5px]",
    secondary:
      "bg-white text-black border-black hover:bg-black hover:text-white active:border-[5px]",
    destructive:
      "bg-[#FF0000] text-white border-black hover:bg-black hover:text-[#FF0000] active:border-[5px]",
    ghost:
      "bg-transparent text-black border-transparent underline hover:text-[#0000FF] hover:bg-transparent",
  };

  const disabledClasses =
    "bg-[#F0F0F0] text-[#888888] border-[#CCCCCC] cursor-not-allowed hover:bg-[#F0F0F0] hover:text-[#888888] hover:border-[#CCCCCC]";

  return (
    <button
      disabled={disabled}
      className={`${base} ${sizeClasses[size]} ${disabled ? disabledClasses : variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
