"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Info, Plus, Check, Star } from "lucide-react";
import { MediaContent } from "@/lib/types";
import { useFlips } from "@/components/providers/FlipsContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface HeroBannerProps {
  items: MediaContent[];
}

export function HeroBanner({ items }: HeroBannerProps) {
  const { setSelectedContent, toggleWatchlist, isInWatchlist } = useFlips();
  const [activeIndex, setActiveIndex] = useState(0);

  const featured = items.length > 0 ? items : [];

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;
  const current = featured[activeIndex % featured.length];
  const inList = isInWatchlist(current.id);

  return (
    <section
      aria-label="Featured spotlight"
      className="relative min-h-[82vh] md:min-h-[88vh] w-full flex items-end overflow-hidden bg-black"
    >
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          key={current.id}
          src={current.backdropUrl}
          alt={current.title}
          className="h-full w-full object-cover object-center scale-[1.02] transition-opacity duration-700"
        />
        {/* Netflix-style cinematic dark vignettes + subtle crimson ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-black/40" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#E50914]/20 blur-[120px] pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12 pb-20 md:pb-28 pt-32">
        <div className="max-w-2xl space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            {current.isOriginal && <Badge variant="red">Flipss Original</Badge>}
            <Badge variant="gold">
              <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
              {current.imdbRating}
            </Badge>
            <Badge variant="outline">{current.releaseYear}</Badge>
            <Badge variant="outline">{current.maturityRating}</Badge>
            <Badge variant="outline">4K HDR</Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.04] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            {current.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed line-clamp-3 max-w-xl">
            {current.synopsis}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300">
            {current.genres.map((g, i) => (
              <React.Fragment key={g}>
                <span>{g}</span>
                {i < current.genres.length - 1 && (
                  <span className="h-1 w-1 rounded-full bg-[#E50914]" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href={`/watch/${current.slug}`}>
              <Button variant="primary" size="lg">
                <Play className="h-5 w-5 fill-white" />
                Play Now
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => setSelectedContent(current)}
            >
              <Info className="h-5 w-5" />
              More Info
            </Button>

            <button
              type="button"
              onClick={() => toggleWatchlist(current.id)}
              aria-label={inList ? "Remove from My List" : "Add to My List"}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
            >
              {inList ? (
                <Check className="h-5 w-5 text-[#E50914]" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Slide Switcher Indicators */}
        {featured.length > 1 && (
          <div
            className="mt-10 flex items-center gap-2.5"
            role="tablist"
            aria-label="Choose featured title"
          >
            {featured.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Spotlight ${idx + 1}: ${item.title}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "w-10 bg-[#E50914]"
                      : "w-4 bg-white/30 hover:bg-white/60"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
