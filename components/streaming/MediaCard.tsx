"use client";

import React from "react";
import Link from "next/link";
import { Play, Plus, Check, Info, Star } from "lucide-react";
import { MediaContent } from "@/lib/types";
import { useFlips } from "@/components/providers/FlipsContext";
import { Badge } from "@/components/ui/Badge";

interface MediaCardProps {
  item: MediaContent;
  rank?: number;
  variant?: "poster" | "landscape";
}

export function MediaCard({ item, rank, variant = "poster" }: MediaCardProps) {
  const { setSelectedContent, toggleWatchlist, isInWatchlist } = useFlips();
  const inList = isInWatchlist(item.id);

  const aspectClass = variant === "landscape" ? "aspect-video" : "aspect-[2/3]";

  return (
    <article
      className={`flips-card group relative flex flex-col rounded-xl bg-[#141414] border border-white/5 hover:border-[#E50914]/60 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.75)] ${
        rank ? "ml-7" : ""
      }`}
    >
      {/* Optional Top 10 Rank Overlay */}
      {rank && (
        <span
          aria-hidden="true"
          className="top-ten-number pointer-events-none absolute -left-7 bottom-2 z-20 text-[96px] font-black leading-none select-none"
        >
          {rank}
        </span>
      )}

      {/* Media Image */}
      <div className={`relative w-full overflow-hidden bg-neutral-900 ${aspectClass}`}>
        <img
          src={variant === "landscape" ? item.backdropUrl : item.posterUrl}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 z-10">
          {item.isOriginal && (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#E50914] text-xs font-black text-white shadow">
              F
            </span>
          )}
          <Badge variant="dark">{item.type === "series" ? "Series" : "Movie"}</Badge>
        </div>

        {/* Hover Gradient + Quick Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/watch/${item.slug}`}
              aria-label={`Play ${item.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914] text-white hover:bg-[#F6121D] shadow-lg transition-transform hover:scale-105"
            >
              <Play className="h-4 w-4 fill-white ml-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => toggleWatchlist(item.id)}
              aria-label={
                inList
                  ? `Remove ${item.title} from My List`
                  : `Add ${item.title} to My List`
              }
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/75 text-white border border-white/25 hover:border-white transition-colors cursor-pointer"
            >
              {inList ? (
                <Check className="h-4 w-4 text-[#E50914]" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelectedContent(item)}
            aria-label={`More info about ${item.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/75 text-white border border-white/25 hover:border-white transition-colors cursor-pointer"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card Metadata */}
      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#E50914] transition-colors">
            <button
              type="button"
              onClick={() => setSelectedContent(item)}
              className="text-left cursor-pointer focus-visible:outline-none"
            >
              {item.title}
            </button>
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
            <span className="inline-flex items-center gap-0.5 text-amber-400 font-semibold">
              <Star className="h-3 w-3 fill-amber-400" />
              {item.imdbRating}
            </span>
            <span>{item.releaseYear}</span>
            <span className="rounded border border-white/20 px-1 text-[10px]">
              {item.maturityRating}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-neutral-500 line-clamp-1">
          {item.genres.slice(0, 3).join(" • ")}
        </p>
      </div>
    </article>
  );
}
