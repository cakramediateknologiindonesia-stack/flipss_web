import type { Metadata } from "next";
import { MyListClient } from "@/components/pages/MyListClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "My List",
  description: "Your saved movies and Flipss Originals watchlist.",
  path: "/my-list",
  noIndex: true,
});

export default function MyListPage() {
  return <MyListClient />;
}
