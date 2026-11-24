"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Crown, LogOut, Menu, X, Bookmark, User } from "lucide-react";
import { useFlips } from "@/components/providers/FlipsContext";
import { Button } from "@/components/ui/Button";
import { SearchModal } from "@/components/layout/SearchModal";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse?type=movie", label: "Movies" },
  { href: "/browse?type=series", label: "Series" },
  { href: "/packages", label: "Packages" },
  { href: "/my-list", label: "My List" },
];

export function Navbar() {
  const pathname = usePathname();
  const {
    user,
    logout,
    activeSubscription,
    setAuthModalOpen,
    searchQuery,
    setSearchQuery,
    watchlistIds,
  } = useFlips();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      const id = requestAnimationFrame(() => searchInputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      {/* Base top gradient layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/90 via-black/45 to-transparent"
      />
      {/* Scrolled glassmorphic layer (compositor-accelerated opacity transition) */}
      <div
        aria-hidden="true"
        data-scrolled={scrolled}
        className="flips-navbar-bg pointer-events-none absolute inset-0 bg-[#0a0a0a]/92 backdrop-blur-xl border-b border-[#0a0a0a]/92 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
      />
      <div className="relative mx-auto flex h-16 md:h-20 max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E50914] rounded"
            aria-label="Flipss.id Home"
          >
            <img
              src="/images/flipss_full_logo.png"
              alt="Flipss.id"
              className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
            {NAV_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href.split("?")[0]);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-white font-semibold"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.href === "/my-list" && watchlistIds.length > 0 && (
                    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E50914] px-1 text-[10px] font-bold text-white">
                      {watchlistIds.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Plan Badge, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile: Search Modal Trigger */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileSearchOpen(true);
            }}
            aria-label="Search catalog"
            className="flex sm:hidden h-9 w-9 items-center justify-center rounded-full text-neutral-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Desktop: Expandable Search */}
          <div className="relative hidden sm:flex items-center">
            <div
              className={`flex h-9 items-center overflow-hidden rounded-full border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                searchOpen
                  ? "w-64 border-white/25 bg-black/80 px-3 focus-within:border-[#E50914] shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                  : "w-9 border-transparent bg-transparent hover:bg-white/10"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (!searchOpen) {
                    setSearchOpen(true);
                  } else {
                    searchInputRef.current?.focus();
                  }
                }}
                aria-label="Search catalog"
                aria-expanded={searchOpen}
                className={`flex shrink-0 items-center justify-center transition-all duration-300 cursor-pointer ${
                  searchOpen
                    ? "h-4 w-4 mr-2 text-neutral-400"
                    : "h-9 w-9 text-neutral-200 hover:text-white"
                }`}
              >
                <Search className={searchOpen ? "h-4 w-4" : "h-5 w-5"} />
              </button>
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchQuery("");
                    setSearchOpen(false);
                  }
                }}
                placeholder="Titles, genres..."
                aria-label="Search movies and series"
                aria-hidden={!searchOpen}
                tabIndex={searchOpen ? 0 : -1}
                className={`bg-transparent text-sm text-white placeholder-neutral-500 outline-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  searchOpen
                    ? "w-full opacity-100"
                    : "w-0 opacity-0 pointer-events-none"
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
                aria-label="Close search"
                aria-hidden={!searchOpen}
                tabIndex={searchOpen ? 0 : -1}
                className={`flex shrink-0 items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 cursor-pointer ${
                  searchOpen
                    ? "w-4 opacity-100 scale-100 ml-1.5"
                    : "w-0 opacity-0 scale-75 ml-0 pointer-events-none"
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Plan Pill */}
          <Link
            href="/packages"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#E50914]/50 bg-[#E50914]/15 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-[#E50914] hover:text-white transition-colors"
          >
            <Crown className="h-3.5 w-3.5 text-[#E50914] group-hover:text-white" />
            {activeSubscription?.package?.name
              ? `${activeSubscription.package.name} Plan`
              : "Upgrade Plan"}
          </Link>

          {/* Auth / User */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white border border-white/10">
                <User className="h-3.5 w-3.5 text-[#E50914]" />
                <span>{user.name}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-neutral-200 hover:bg-[#E50914] hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setAuthModalOpen(true)}>
              Sign In
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-md text-white hover:bg-white/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="relative md:hidden bg-[#0e0e0e] border-b border-white/10 px-6 py-4 space-y-3">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-base font-medium text-neutral-200 hover:text-[#E50914]"
            >
              <span>{item.label}</span>
              {item.href === "/my-list" && (
                <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                  <Bookmark className="h-3.5 w-3.5" /> {watchlistIds.length}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
      {/* Mobile Search Modal */}
      <SearchModal
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </header>
  );
}
