"use client";

import React from "react";
import { Check, Sparkles, Monitor, Download } from "lucide-react";
import { StreamingPackage } from "@/lib/types";
import { formatIDR } from "@/lib/catalog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface PackageCardProps {
  pkg: StreamingPackage;
  billingCycle: "monthly" | "yearly";
  isActive?: boolean;
  loading?: boolean;
  onSelect: (pkg: StreamingPackage) => void;
}

export function PackageCard({
  pkg,
  billingCycle,
  isActive = false,
  loading = false,
  onSelect,
}: PackageCardProps) {
  const displayPrice =
    billingCycle === "yearly" ? Math.round(pkg.priceYearly / 12) : pkg.priceMonthly;

  return (
    <article
      className={`relative flex flex-col rounded-2xl p-6 transition-all duration-300 ${
        pkg.isPopular
          ? "bg-gradient-to-b from-[#24090b] via-[#161616] to-[#121212] border-2 border-[#E50914] shadow-[0_20px_60px_rgba(229,9,20,0.22)] md:-translate-y-2"
          : "bg-[#141414] border border-white/10 hover:border-white/25"
      }`}
    >
      {/* Top Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          {pkg.resolution}
        </span>
        {pkg.isPopular ? (
          <Badge variant="red">
            <Sparkles className="h-3 w-3" />
            Most Popular
          </Badge>
        ) : isActive ? (
          <Badge variant="green">Current Plan</Badge>
        ) : null}
      </div>

      {/* Plan Title */}
      <h3 className="text-2xl font-black text-white">{pkg.name}</h3>
      <p className="mt-1 text-xs text-neutral-400 min-h-[2rem]">{pkg.tagline}</p>

      {/* Price */}
      <div className="my-6 pb-6 border-b border-white/10">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-white tracking-tight">
            {formatIDR(displayPrice)}
          </span>
          <span className="text-xs text-neutral-400">/ month</span>
        </div>
        {billingCycle === "yearly" && (
          <p className="mt-1 text-xs text-emerald-400 font-medium">
            Billed {formatIDR(pkg.priceYearly)} yearly (Save 2 months)
          </p>
        )}
      </div>

      {/* Quick Specs */}
      <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs">
        <div className="rounded-lg bg-white/[0.04] p-2.5 border border-white/5 flex items-center gap-2">
          <Monitor className="h-4 w-4 text-[#E50914] shrink-0" />
          <span className="text-neutral-200">{pkg.maxDevices} Screens</span>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-2.5 border border-white/5 flex items-center gap-2">
          <Download className="h-4 w-4 text-[#E50914] shrink-0" />
          <span className="text-neutral-200">{pkg.downloadsAllowed} Downloads</span>
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-8 flex-1 text-sm text-neutral-300">
        {pkg.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E50914]/20 text-[#E50914] shrink-0">
              <Check className="h-3 w-3" />
            </span>
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      {/* Action */}
      <Button
        variant={pkg.isPopular ? "primary" : isActive ? "outline" : "secondary"}
        fullWidth
        disabled={loading}
        onClick={() => onSelect(pkg)}
      >
        {isActive
          ? "Active Plan"
          : loading
          ? "Activating..."
          : `Choose ${pkg.name}`}
      </Button>
    </article>
  );
}
