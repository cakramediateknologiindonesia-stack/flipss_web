import type { Metadata } from "next";
import { BrowseClient } from "@/components/pages/BrowseClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Browse Movies & Original Series",
  description:
    "Explore the full Flipss.id catalog of Indonesian Originals, blockbuster movies, and 4K HDR series by genre and format.",
  path: "/browse",
});

export default function BrowsePage() {
  return <BrowseClient />;
}
