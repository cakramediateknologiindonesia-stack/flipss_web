"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SPLASH_MS = 2532;
const REDUCED_MOTION_MS = 1200;

export function SplashScreen() {
  const pathname = usePathname();
  const [initialPath] = useState(pathname);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? REDUCED_MOTION_MS : SPLASH_MS;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      html.style.overflow = previousOverflow;
      setDone(true);
    }, duration);
    return () => {
      window.clearTimeout(timer);
      html.style.overflow = previousOverflow;
    };
  }, []);

  if (done || initialPath !== "/") return null;

  return (
    <div
      className="flips-splash fixed inset-0 z-[100] flex items-center justify-center bg-black"
      role="status"
      aria-label="Flipss.id loading"
    >
      <picture>
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet="/images/flipss_splash.png"
        />
        <img
          src="/images/flipss_splash_animated.webp"
          alt="Flipss"
          className="h-full w-full object-contain"
        />
      </picture>
      <span className="sr-only">Loading Flipss.id</span>
    </div>
  );
}
