import type { MetadataRoute } from "next";
import { fetchContents } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/browse"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/packages"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const contents = await fetchContents();
  const contentRoutes: MetadataRoute.Sitemap = contents.map((item) => ({
    url: absoluteUrl(`/watch/${item.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: item.isFeatured || item.isTrending ? 0.85 : 0.7,
  }));

  return [...staticRoutes, ...contentRoutes];
}
