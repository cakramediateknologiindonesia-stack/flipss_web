import React from "react";

type BadgeVariant = "red" | "outline" | "dark" | "gold" | "green";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  red: "bg-[#E50914] text-white font-bold tracking-wider uppercase",
  outline: "border border-white/35 text-neutral-200 bg-black/40",
  dark: "bg-black/75 text-neutral-100 border border-white/10",
  gold: "bg-amber-500/20 text-amber-300 border border-amber-400/35",
  green: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold",
};

export function Badge({ children, variant = "outline", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] leading-tight ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
