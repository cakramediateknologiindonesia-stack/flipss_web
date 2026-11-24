"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Play, Search, Star, X } from "lucide-react";
import { useFlips } from "@/components/providers/FlipsContext";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { Badge } from "@/components/ui/Badge";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_TAGS = ["Sci-Fi", "Thriller", "Jakarta", "Action", "Drama"];

export function SearchModal({ open, onClose }: SearchModalProps) {
  const { contents, searchQuery, setSearchQuery, setSelectedContent } = useFlips();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const trimmedQuery = searchQuery.trim();

  const results = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    if (!q) return [];
    return contents.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.synopsis.toLowerCase().includes(q) ||
        c.genres.some((g) => g.toLowerCase().includes(q))
    );
  }, [contents, trimmedQuery]);

  const trendingSuggestions = useMemo(
    () => contents.filter((c) => c.isTrending).slice(0, 4),
    [contents]
  );

  const displayedItems = trimmedQuery ? results : trendingSuggestions;

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      titleId="search-modal-title"
      maxWidthClass="max-w-lg"
    >
      <div className="p-5 sm:p-6 space-y-4">
        <div className="pr-12">
          <h1 id="search-modal-title" className="text-lg font-black text-white tracking-tight">
            Search Catalog
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Find movies, series, and genres on Flipss.id
          </p>
        </div>

        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            inputRef.current?.blur();
          }}
          className="relative flex items-center rounded-xl bg-[#1e1e1e] border border-white/15 px-3.5 py-2.5 focus-within:border-[#E50914] transition-colors"
        >
          <Search className="h-4 w-4 text-neutral-400 mr-2.5 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Titles, genres, synopsis..."
            aria-label="Search movies and series"
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
          />
          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search query"
              className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        {/* Quick Genre Chips when empty */}
        {!trimmedQuery && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mr-1">
              Popular:
            </span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-200 hover:border-[#E50914] hover:bg-[#E50914]/15 hover:text-white transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results / Trending List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              {trimmedQuery
                ? `Results (${results.length})`
                : "Trending Searches"}
            </p>
            {trimmedQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {displayedItems.length > 0 ? (
            <ul className="divide-y divide-white/10 max-h-[50dvh] overflow-y-auto pr-1">
              {displayedItems.map((item) => (
                <li key={item.id} className="py-2.5 first:pt-1 last:pb-1">
                  <div className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-white/5 transition-colors">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setSelectedContent(item);
                      }}
                      className="flex flex-1 min-w-0 items-center gap-3 text-left cursor-pointer"
                    >
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="h-16 w-11 shrink-0 rounded-lg object-cover bg-neutral-900 border border-white/10"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-bold text-white truncate">
                          {item.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
                          <Badge variant="dark">
                            {item.type === "series" ? "Series" : "Movie"}
                          </Badge>
                          <span>{item.releaseYear}</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-300 font-semibold">
                            <Star className="h-3 w-3 fill-amber-300" />
                            {item.imdbRating}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {item.genres.join(" • ")}
                        </p>
                      </div>
                    </button>

                    <Link
                      href={`/watch/${item.slug}`}
                      onClick={onClose}
                      aria-label={`Play ${item.title}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E50914] text-white hover:bg-[#F6121D] transition-colors"
                    >
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl bg-[#1a1a1a] border border-white/10 p-6 text-center">
              <p className="text-sm font-semibold text-neutral-200">
                No titles matched &ldquo;{trimmedQuery}&rdquo;.
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for Sci-Fi, Thriller, Jakarta, or Action.
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}
