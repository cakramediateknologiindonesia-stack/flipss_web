"use client";

import { useEffect } from "react";

/** Registers the Flipss.id PWA service worker on supported browsers. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      .catch(() => {
        // Service worker registration can fail on non-HTTPS origins other than localhost
      });
  }, []);

  return null;
}
