"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaContent } from "@/lib/types";
import { MediaCard } from "./MediaCard";

interface ContentRowProps {
  title: string;
  subtitle?: string;
  items: MediaContent[];
  ranked?: boolean;
  variant?: "poster" | "landscape";
}

export function ContentRow({
  title,
  subtitle,
  items,
  ranked = false,
  variant = "poster",
}: ContentRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState("");

  if (items.length === 0) return null;

  const scrollTrack = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const step = Math.max(track.clientWidth * 0.78, 300);
    track.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    setStatusMessage(`Scrolled ${title} ${direction === "next" ? "forward" : "backward"}`);
  };

  const slideWidthClass =
    variant === "landscape"
      ? "w-[260px] sm:w-[300px] md:w-[330px]"
      : "w-[168px] sm:w-[195px] md:w-[215px]";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      className="relative group/row py-4"
    >
      {/* Header + Controls */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="h-5 w-1 rounded-full bg-[#E50914]" aria-hidden="true" />
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs sm:text-sm text-neutral-400">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollTrack("prev")}
            aria-label={`Previous items in ${title}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white border border-white/15 hover:bg-[#E50914] hover:border-[#E50914] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E50914]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack("next")}
            aria-label={`Next items in ${title}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white border border-white/15 hover:bg-[#E50914] hover:border-[#E50914] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E50914]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Native Scrollable Carousel Track */}
      <div
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label={`${title} slides`}
        className="flips-carousel-track no-scrollbar gap-4 px-4 sm:px-8 lg:px-12 pb-3 mx-auto max-w-[1440px]"
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${items.length}`}
            className={`flips-carousel-slide shrink-0 ${slideWidthClass}`}
          >
            <MediaCard
              item={item}
              rank={ranked ? idx + 1 : undefined}
              variant={variant}
            />
          </div>
        ))}
      </div>

      {/* Polite status region for assistive technology */}
      <p className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </section>
  );
}
