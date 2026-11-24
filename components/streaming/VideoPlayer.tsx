"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
  ArrowLeft,
} from "lucide-react";
import { MediaContent, Episode } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface VideoPlayerProps {
  content: MediaContent;
  activeEpisode?: Episode | null;
}

function formatTime(sec: number) {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function VideoPlayer({ content, activeEpisode }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const streamSrc =
    activeEpisode?.videoUrl ||
    content.signedStreamUrl ||
    content.videoUrl ||
    content.trailerUrl ||
    "";

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const skip = (seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + seconds), duration || 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.currentTime = val;
    setCurrentTime(val);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video max-h-[80vh] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.9)] group"
    >
      <video
        ref={videoRef}
        key={streamSrc}
        src={streamSrc}
        poster={activeEpisode?.thumbnailUrl || content.backdropUrl}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        className="h-full w-full object-contain bg-black cursor-pointer"
        playsInline
      />

      {/* Top Overlay Bar */}
      <div className="absolute inset-x-0 top-0 p-4 sm:p-6 bg-gradient-to-b from-black/85 to-transparent flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white border border-white/15 hover:bg-[#E50914] hover:border-[#E50914] transition-colors"
            aria-label="Back to Flipss.id home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#E50914] font-bold">
              Now Streaming on Flipss.id
            </p>
            <h1 className="text-base sm:text-xl font-bold text-white">
              {content.title}
              {activeEpisode
                ? ` — S${activeEpisode.seasonNumber}E${activeEpisode.episodeNumber}: ${activeEpisode.title}`
                : ""}
            </h1>
          </div>
        </div>
        <Badge variant="red">4K HDR</Badge>
      </div>

      {/* Center Play Button when Paused */}
      {!playing && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E50914]/90 hover:bg-[#F6121D] text-white shadow-[0_0_50px_rgba(229,9,20,0.75)] transition-transform hover:scale-110 cursor-pointer"
        >
          <Play className="h-9 w-9 fill-white ml-1" />
        </button>
      )}

      {/* Bottom Controls */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent space-y-3">
        {/* Progress Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-300 w-10">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek video timeline"
            className="w-full accent-[#E50914] h-1.5 cursor-pointer"
          />
          <span className="text-xs font-mono text-neutral-300 w-10 text-right">
            {formatTime(duration)}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[#E50914] text-white transition-colors cursor-pointer"
            >
              {playing ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 fill-white ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => skip(-10)}
              aria-label="Rewind 10 seconds"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15 text-neutral-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => skip(10)}
              aria-label="Forward 10 seconds"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15 text-neutral-200 transition-colors cursor-pointer"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15 text-neutral-200 transition-colors cursor-pointer"
            >
              {muted ? (
                <VolumeX className="h-4 w-4 text-[#E50914]" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15 text-neutral-200 transition-colors cursor-pointer"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
