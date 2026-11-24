"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Play, Plus, Check, Star } from "lucide-react";
import { useFlips } from "@/components/providers/FlipsContext";
import { fetchContentBySlug } from "@/lib/api";
import { MediaContent } from "@/lib/types";
import { VideoPlayer } from "@/components/streaming/VideoPlayer";
import { ContentRow } from "@/components/streaming/ContentRow";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function WatchInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = String(params?.slug || "");
  const epParam = Number(searchParams.get("ep") || 1);

  const { contents, toggleWatchlist, isInWatchlist } = useFlips();
  const [content, setContent] = useState<MediaContent | null>(() =>
    contents.find((c) => c.slug === slug) || null
  );
  const [selectedEpNum, setSelectedEpNum] = useState<number>(epParam);

  useEffect(() => {
    fetchContentBySlug(slug).then((data) => {
      if (data) setContent(data);
    });
  }, [slug]);

  useEffect(() => {
    setSelectedEpNum(epParam);
  }, [epParam]);

  const activeEpisode = useMemo(() => {
    if (!content?.episodes || content.episodes.length === 0) return null;
    return (
      content.episodes.find((e) => e.episodeNumber === selectedEpNum) ||
      content.episodes[0]
    );
  }, [content, selectedEpNum]);

  const related = useMemo(
    () => contents.filter((c) => c.slug !== slug).slice(0, 8),
    [contents, slug]
  );

  if (!content) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-36 pb-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-white">Title not found</h1>
        <p className="text-sm text-neutral-400">
          We couldn&apos;t locate this title in the Flipss.id library.
        </p>
        <Link href="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const inList = isInWatchlist(content.id);

  return (
    <div className="pt-22 pb-16 space-y-10">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 space-y-8">
        {/* Video Player */}
        <VideoPlayer content={content} activeEpisode={activeEpisode} />

        {/* Title Info Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {content.isOriginal && <Badge variant="red">Flipss Original</Badge>}
              <Badge variant="gold">
                <Star className="h-3 w-3 fill-amber-300" />
                {content.imdbRating}
              </Badge>
              <Badge variant="outline">{content.releaseYear}</Badge>
              <Badge variant="outline">{content.maturityRating}</Badge>
              <Badge variant="outline">4K HDR</Badge>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {content.title}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleWatchlist(content.id)}
              >
                {inList ? (
                  <>
                    <Check className="h-4 w-4 text-[#E50914]" />
                    In My List
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add to My List
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {content.synopsis}
            </p>

            <div className="text-xs text-neutral-400 space-y-1">
              <p>
                <span className="text-neutral-500">Cast:</span>{" "}
                {content.cast.join(", ")}
              </p>
              <p>
                <span className="text-neutral-500">Genres:</span>{" "}
                {content.genres.join(" • ")}
              </p>
            </div>
          </div>

          {/* Episode Switcher (Series) */}
          {content.episodes && content.episodes.length > 0 && (
            <div className="rounded-2xl bg-[#141414] border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">Episodes</h3>
                <span className="text-xs text-neutral-400">Season 1</span>
              </div>
              <div className="space-y-2.5">
                {content.episodes.map((ep) => {
                  const isCurrent = activeEpisode?.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => setSelectedEpNum(ep.episodeNumber)}
                      className={`w-full text-left flex items-center gap-3 rounded-xl p-2.5 transition-colors cursor-pointer border ${
                        isCurrent
                          ? "bg-[#E50914]/15 border-[#E50914]"
                          : "bg-white/[0.03] border-white/5 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="relative h-14 w-24 rounded-lg overflow-hidden shrink-0 bg-black">
                        <img
                          src={ep.thumbnailUrl}
                          alt={ep.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className="h-4 w-4 fill-white text-white" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white line-clamp-1">
                          {ep.episodeNumber}. {ep.title}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {ep.durationMinutes} min
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* More Like This */}
      <ContentRow title="More Like This" items={related} />
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 pt-32 pb-20 text-neutral-400">
          Loading player...
        </div>
      }
    >
      <WatchInner />
    </Suspense>
  );
}
