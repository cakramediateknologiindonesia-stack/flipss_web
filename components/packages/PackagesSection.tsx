"use client";

import React, { useState } from "react";
import { ShieldCheck, Zap, Tv } from "lucide-react";
import { useFlips } from "@/components/providers/FlipsContext";
import { StreamingPackage } from "@/lib/types";
import { PackageCard } from "./PackageCard";

export function PackagesSection({
  compact = false,
  asH1 = false,
}: {
  compact?: boolean;
  asH1?: boolean;
}) {
  const HeadingTag = asH1 ? "h1" : "h2";
  const { packages, activeSubscription, selectPackage } = useFlips();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSelect = async (pkg: StreamingPackage) => {
    setBusyId(pkg.id);
    try {
      const msg = await selectPackage(pkg, billingCycle);
      setToast(msg);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section
      id="packages"
      aria-labelledby="packages-heading"
      className={`mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 ${
        compact ? "py-16" : "py-12"
      }`}
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-block rounded-full bg-[#E50914]/15 border border-[#E50914]/40 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#E50914]">
          Flexible Membership Packages
        </span>
        <HeadingTag
          id="packages-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white"
        >
          Choose the plan that fits your screen
        </HeadingTag>
        <p className="text-sm sm:text-base text-neutral-400">
          No hidden fees. Cancel or switch packages anytime. Every plan includes
          unlimited Flipss Originals and zero ads.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-3 flex items-center justify-center">
          <div className="inline-flex rounded-full bg-[#161616] p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#E50914] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-[#E50914] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] text-emerald-300 font-bold">
                -17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Banner */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="mt-8 mx-auto max-w-xl rounded-xl bg-emerald-500/15 border border-emerald-500/40 px-4 py-3 text-center text-sm font-medium text-emerald-300"
        >
          {toast}
        </div>
      )}

      {/* Package Cards Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            billingCycle={billingCycle}
            isActive={activeSubscription?.package?.slug === pkg.slug}
            loading={busyId === pkg.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Trust Highlights */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="rounded-xl bg-[#141414] border border-white/5 p-5 flex items-start gap-3">
          <Tv className="h-5 w-5 text-[#E50914] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-white">Watch Everywhere</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Smart TV, Web, iOS, Android, and Apple TV with instant sync.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-[#141414] border border-white/5 p-5 flex items-start gap-3">
          <Zap className="h-5 w-5 text-[#E50914] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-white">Zero-Buffer Streaming</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Ultra-low latency 1080p Full HD streaming engineered for Indonesian networks.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-[#141414] border border-white/5 p-5 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[#E50914] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-white">Cancel Anytime</h3>
            <p className="text-xs text-neutral-400 mt-1">
              No lock-in contracts. Upgrade, downgrade, or pause in one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
