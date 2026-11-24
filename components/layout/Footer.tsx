import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#080808] text-neutral-400">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#E50914] font-black text-white">
                F
              </span>
              <span className="text-xl font-black tracking-tight text-white">
                FLIPSS<span className="text-[#E50914]">.ID</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              Indonesia&apos;s next-generation streaming platform. Watch award-winning
              Flipss Originals, blockbusters, and 1080p Full HD cinema anytime, anywhere.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  All Catalog
                </Link>
              </li>
              <li>
                <Link href="/browse?type=movie" className="hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/browse?type=series" className="hover:text-white transition-colors">
                  Original Series
                </Link>
              </li>
              <li>
                <Link href="/my-list" className="hover:text-white transition-colors">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Membership
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/packages" className="hover:text-white transition-colors">
                  Packages &amp; Pricing
                </Link>
              </li>
              <li>
                <Link href="/packages#faq" className="hover:text-white transition-colors">
                  Plan FAQ
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:5000/api-docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  API Documentation (Swagger)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Streaming Tech
            </h3>
            <p className="text-sm leading-relaxed">
              Powered by high-speed global media delivery, adaptive 1080p Full HD playback,
              and ultra-smooth Lenis navigation.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Flipss.id. All rights reserved.</p>
          <p>Crafted in Cinema Red &amp; Obsidian Black</p>
        </div>
      </div>
    </footer>
  );
}
