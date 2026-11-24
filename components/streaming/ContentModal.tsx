"use client";

import React from "react";
import Link from "next/link";
import { Play, Plus, Check, Star, Clock, Users } from "lucide-react";
import { useFlips } from "@/components/providers/FlipsContext";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function ContentModal() {
  const { selectedContent, setSelectedContent, toggleWatchlist, isInWatchlist } =
    useFlips();

  if (!selectedContent) return null;

  const inList = isInWatchlist(selectedContent.id);

  return (
    <ModalDialog
      open={Boolean(selectedContent)}
      onClose={() => setSelectedContent(null)}
      titleId="content-modal-title"
      maxWidthClass="max-w-4xl"
    >
      {/* Hero Banner inside Modal */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img
          src={selectedContent.backdropUrl}
          alt={selectedContent.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {selectedContent.isOriginal && (
              <Badge variant="red">Flipss Original</Badge>
            )}
            <Badge variant="gold">
              <Star className="h-3 w-3 fill-amber-300" />
              {selectedContent.imdbRating}
            </Badge>
            <Badge variant="outline">{selectedContent.releaseYear}</Badge>
            <Badge variant="outline">{selectedContent.maturityRating}</Badge>
            <Badge variant="outline">4K HDR</Badge>
          </div>

          <h1
            id="content-modal-title"
            className="text-2xl sm:text-4xl font-black text-white tracking-tight"
          >
            {selectedContent.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/watch/${selectedContent.slug}`}
              onClick={() => setSelectedContent(null)}
            >
              <Button variant="primary" size="md">
                <Play className="h-4 w-4 fill-white" />
                Play Now
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="md"
              onClick={() => toggleWatchlist(selectedContent.id)}
            >
              {inList ? (
                <>
                  <Check className="h-4 w-4 text-[#E50914]" />
                  In My List
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  My List
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <span className="text-emerald-400 font-bold">
                {selectedContent.matchPercent || 96}% Match
              </span>
              <span className="inline-flex items-center gap-1 text-neutral-400">
                <Clock className="h-3.5 w-3.5" />
                {selectedContent.durationMinutes} min
                {selectedContent.type === "series" ? " / ep" : ""}
              </span>
              <span className="uppercase text-xs text-neutral-400">
                {selectedContent.type}
              </span>
            </div>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
              {selectedContent.synopsis}
            </p>
          </div>

          <div className="space-y-3 text-sm border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-neutral-500 block text-xs uppercase tracking-wider mb-1">
                Cast
              </span>
              <p className="text-neutral-200 flex items-start gap-1.5">
                <Users className="h-4 w-4 text-[#E50914] shrink-0 mt-0.5" />
                <span>{selectedContent.cast.join(", ")}</span>
              </p>
            </div>
            <div>
              <span className="text-neutral-500 block text-xs uppercase tracking-wider mb-1">
                Genres
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedContent.genres.map((g) => (
                  <Badge key={g} variant="dark">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Episodes Section (for Series) */}
        {selectedContent.episodes && selectedContent.episodes.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Episodes</h2>
              <span className="text-xs text-neutral-400">
                Season 1 • {selectedContent.episodes.length} Episodes
              </span>
            </div>

            <div className="space-y-3">
              {selectedContent.episodes.map((ep) => (
                <Link
                  key={ep.id}
                  href={`/watch/${selectedContent.slug}?ep=${ep.episodeNumber}`}
                  onClick={() => setSelectedContent(null)}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#E50914]/50 p-3 transition-colors"
                >
                  <div className="relative w-full sm:w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-neutral-900">
                    <img
                      src={ep.thumbnailUrl}
                      alt={ep.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E50914] text-white">
                        <Play className="h-4 w-4 fill-white ml-0.5" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors">
                        {ep.episodeNumber}. {ep.title}
                      </h3>
                      <span className="text-xs text-neutral-400 shrink-0">
                        {ep.durationMinutes}m
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                      {ep.synopsis}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
