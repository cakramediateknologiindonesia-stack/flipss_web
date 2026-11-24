"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#E50914] hover:bg-[#F6121D] text-white shadow-[0_6px_24px_rgba(229,9,20,0.35)] border border-[#E50914]",
  secondary:
    "bg-white text-black hover:bg-neutral-200 border border-white font-semibold",
  ghost:
    "bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/15",
  outline:
    "bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white/60",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-md gap-2",
  lg: "px-7 py-3.5 text-base rounded-lg gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E50914] active:scale-[0.98] ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
