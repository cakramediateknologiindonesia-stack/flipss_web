"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useFlips } from "@/components/providers/FlipsContext";
import { MediaCard } from "@/components/streaming/MediaCard";
import { Button } from "@/components/ui/Button";

export default function MyListPage() {
  const { contents, watchlistIds } = useFlips();

  const savedItems = useMemo(
    () => contents.filter((c) => watchlistIds.includes(c.id)),
    [contents, watchlistIds]
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 pt-28 pb-20 min-h-[70vh]">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#E50914]">
          Personal Queue
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          My List ({savedItems.length})
        </h1>
      </div>

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {savedItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#141414] border border-white/10 p-14 text-center max-w-xl mx-auto space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E50914]/15 text-[#E50914]">
            <Bookmark className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Your watchlist is empty</h2>
          <p className="text-sm text-neutral-400">
            Click the &ldquo;+&rdquo; icon on any movie or Flipss Original series to
            save it here for later.
          </p>
          <div className="pt-2">
            <Link href="/browse">
              <Button variant="primary">Explore Catalog</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
