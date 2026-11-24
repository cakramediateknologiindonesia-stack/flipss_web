"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useFlips } from "@/components/providers/FlipsContext";
import { MediaCard } from "@/components/streaming/MediaCard";

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "all";
  const initialQuery = searchParams.get("q") || "";

  const { contents } = useFlips();
  const [typeFilter, setTypeFilter] = useState<string>(initialType);
  const [genreFilter, setGenreFilter] = useState<string>("All");
  const [query, setQuery] = useState(initialQuery);

  const allGenres = useMemo(() => {
    const set = new Set<string>(["All"]);
    contents.forEach((c) => c.genres.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [contents]);

  const filtered = useMemo(() => {
    return contents.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (genreFilter !== "All" && !item.genres.includes(genreFilter)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !item.title.toLowerCase().includes(q) &&
          !item.synopsis.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [contents, typeFilter, genreFilter, query]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 pt-28 pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E50914]">
            Flipss.id Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            {typeFilter === "movie"
              ? "Movies"
              : typeFilter === "series"
              ? "Original Series"
              : "Browse All Titles"}
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title or keyword..."
            aria-label="Filter catalog"
            className="w-full rounded-xl bg-[#141414] border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-[#E50914] outline-none"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All" },
            { id: "movie", label: "Movies" },
            { id: "series", label: "Series" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                typeFilter === tab.id
                  ? "bg-[#E50914] text-white"
                  : "bg-white/5 text-neutral-300 hover:bg-white/15"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Genre Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {allGenres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setGenreFilter(genre)}
              className={`rounded-full px-3 py-1 text-xs transition-colors cursor-pointer border ${
                genreFilter === genre
                  ? "border-[#E50914] bg-[#E50914]/20 text-white font-semibold"
                  : "border-white/10 bg-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#141414] border border-white/10 p-14 text-center space-y-2">
          <p className="text-lg font-bold text-white">No matching titles found</p>
          <p className="text-sm text-neutral-400">
            Try clearing one of your genre or search filters.
          </p>
        </div>
      )}
    </div>
  );
}

export function BrowseClient() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 pt-32 pb-16 text-neutral-400">
          Loading catalog...
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
