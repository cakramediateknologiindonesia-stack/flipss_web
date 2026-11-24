"use client";

import React, { useMemo } from "react";
import { useFlips } from "@/components/providers/FlipsContext";
import { HeroBanner } from "@/components/streaming/HeroBanner";
import { ContentRow } from "@/components/streaming/ContentRow";
import { MediaCard } from "@/components/streaming/MediaCard";
import { PackagesSection } from "@/components/packages/PackagesSection";

export function HomeClient() {
  const { contents, searchQuery, setSearchQuery } = useFlips();

  const filteredSearch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return contents.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.synopsis.toLowerCase().includes(q) ||
        c.genres.some((g) => g.toLowerCase().includes(q))
    );
  }, [contents, searchQuery]);

  const featured = useMemo(
    () => contents.filter((c) => c.isFeatured),
    [contents]
  );
  const trending = useMemo(
    () => contents.filter((c) => c.isTrending),
    [contents]
  );
  const originals = useMemo(
    () => contents.filter((c) => c.isOriginal),
    [contents]
  );
  const movies = useMemo(
    () => contents.filter((c) => c.type === "movie"),
    [contents]
  );
  const series = useMemo(
    () => contents.filter((c) => c.type === "series"),
    [contents]
  );

  // If user typed in navbar search, show live search results grid
  if (searchQuery.trim().length > 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 pt-28 pb-16 min-h-[70vh]">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#E50914] font-bold">
              Search Results
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Results for &ldquo;{searchQuery}&rdquo; ({filteredSearch.length})
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-sm text-neutral-400 hover:text-white underline cursor-pointer"
          >
            Clear search
          </button>
        </div>

        {filteredSearch.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredSearch.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#141414] border border-white/10 p-12 text-center">
            <p className="text-neutral-300 font-semibold">
              No titles matched &ldquo;{searchQuery}&rdquo;.
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Try searching for Sci-Fi, Thriller, Jakarta, or Action.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Full-Bleed Cinematic Billboard */}
      <HeroBanner items={featured.length > 0 ? featured : contents.slice(0, 3)} />

      {/* Overlapping Streaming Rows */}
      <div className="relative z-20 -mt-12 space-y-6">
        <ContentRow
          title="Top Trending on Flipss.id"
          subtitle="Most watched across Indonesia right now"
          items={trending.length > 0 ? trending : contents}
          ranked
        />

        <ContentRow
          title="Flipss Originals"
          subtitle="Exclusive Nusantara cinema & prestige series in 1080p Full HD"
          items={originals}
          variant="landscape"
        />

        <ContentRow
          title="Blockbuster Movies"
          subtitle="Adrenaline-packed feature films ready to stream"
          items={movies}
        />

        <ContentRow
          title="Binge-Worthy Series"
          subtitle="Gripping multi-episode worlds crafted for late-night marathons"
          items={series}
        />
      </div>

      {/* Membership Packages Section */}
      <div className="mt-16 border-t border-white/10 bg-gradient-to-b from-[#0f0506] via-[#0a0a0a] to-[#0a0a0a]">
        <PackagesSection compact />
      </div>
    </div>
  );
}
