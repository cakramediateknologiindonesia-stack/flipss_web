"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { MediaContent, StreamingPackage, UserProfile, UserSubscription } from "@/lib/types";
import { FALLBACK_CONTENTS, FALLBACK_PACKAGES } from "@/lib/catalog";
import {
  fetchContents,
  fetchPackages,
  subscribeToPackage,
  syncWatchlistAdd,
  syncWatchlistRemove,
} from "@/lib/api";

interface FlipsContextValue {
  contents: MediaContent[];
  packages: StreamingPackage[];
  watchlistIds: string[];
  toggleWatchlist: (contentId: string) => void;
  isInWatchlist: (contentId: string) => boolean;
  selectedContent: MediaContent | null;
  setSelectedContent: (item: MediaContent | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  user: UserProfile | null;
  token: string | null;
  activeSubscription: UserSubscription | null;
  setSession: (user: UserProfile, token: string, sub?: UserSubscription | null) => void;
  logout: () => void;
  selectPackage: (pkg: StreamingPackage, billingCycle: "monthly" | "yearly") => Promise<string>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const FlipsContext = createContext<FlipsContextValue | null>(null);

export function FlipsProvider({ children }: { children: React.ReactNode }) {
  const [contents, setContents] = useState<MediaContent[]>(FALLBACK_CONTENTS);
  const [packages, setPackages] = useState<StreamingPackage[]>(FALLBACK_PACKAGES);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [selectedContent, setSelectedContent] = useState<MediaContent | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Hydrate local session & watchlist
    try {
      const savedWl = localStorage.getItem("flips_watchlist");
      if (savedWl) setWatchlistIds(JSON.parse(savedWl));

      const savedToken = localStorage.getItem("flips_token");
      const savedUser = localStorage.getItem("flips_user");
      const savedSub = localStorage.getItem("flips_sub");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      if (savedSub) {
        setActiveSubscription(JSON.parse(savedSub));
      }
    } catch {
      // Ignore storage errors
    }

    // Fetch live data from flips_api (falls back seamlessly to curated catalog)
    fetchContents().then(setContents).catch(() => {});
    fetchPackages().then(setPackages).catch(() => {});
  }, []);

  const toggleWatchlist = useCallback(
    (contentId: string) => {
      setWatchlistIds((prev) => {
        const exists = prev.includes(contentId);
        const next = exists ? prev.filter((id) => id !== contentId) : [contentId, ...prev];
        try {
          localStorage.setItem("flips_watchlist", JSON.stringify(next));
        } catch {}

        if (token) {
          if (exists) {
            syncWatchlistRemove(contentId, token).catch(() => {});
          } else {
            syncWatchlistAdd(contentId, token).catch(() => {});
          }
        }
        return next;
      });
    },
    [token]
  );

  const isInWatchlist = useCallback(
    (contentId: string) => watchlistIds.includes(contentId),
    [watchlistIds]
  );

  const setSession = useCallback(
    (newUser: UserProfile, newToken: string, sub?: UserSubscription | null) => {
      setUser(newUser);
      setToken(newToken);
      if (sub !== undefined) setActiveSubscription(sub);
      try {
        localStorage.setItem("flips_user", JSON.stringify(newUser));
        localStorage.setItem("flips_token", newToken);
        if (sub) localStorage.setItem("flips_sub", JSON.stringify(sub));
      } catch {}
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setActiveSubscription(null);
    try {
      localStorage.removeItem("flips_user");
      localStorage.removeItem("flips_token");
      localStorage.removeItem("flips_sub");
    } catch {}
  }, []);

  const selectPackage = useCallback(
    async (pkg: StreamingPackage, billingCycle: "monthly" | "yearly"): Promise<string> => {
      if (token) {
        try {
          const sub = await subscribeToPackage(pkg.id, billingCycle, token);
          setActiveSubscription(sub);
          localStorage.setItem("flips_sub", JSON.stringify(sub));
          return `Activated ${pkg.name} (${billingCycle}) via Flipss API!`;
        } catch {
          // Fallback to local demo activation if backend is offline
        }
      }
      const now = new Date();
      const exp = new Date(now);
      if (billingCycle === "yearly") exp.setFullYear(exp.getFullYear() + 1);
      else exp.setMonth(exp.getMonth() + 1);

      const localSub: UserSubscription = {
        id: `sub-${Date.now()}`,
        packageId: pkg.id,
        billingCycle,
        status: "active",
        startsAt: now.toISOString(),
        expiresAt: exp.toISOString(),
        package: pkg,
      };
      setActiveSubscription(localSub);
      try {
        localStorage.setItem("flips_sub", JSON.stringify(localSub));
      } catch {}
      return `Activated ${pkg.name} (${billingCycle}) plan!`;
    },
    [token]
  );

  return (
    <FlipsContext.Provider
      value={{
        contents,
        packages,
        watchlistIds,
        toggleWatchlist,
        isInWatchlist,
        selectedContent,
        setSelectedContent,
        authModalOpen,
        setAuthModalOpen,
        user,
        token,
        activeSubscription,
        setSession,
        logout,
        selectPackage,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </FlipsContext.Provider>
  );
}

export function useFlips() {
  const ctx = useContext(FlipsContext);
  if (!ctx) throw new Error("useFlips must be used within FlipsProvider");
  return ctx;
}
