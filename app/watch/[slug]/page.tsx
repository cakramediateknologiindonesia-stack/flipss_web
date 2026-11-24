import type { Metadata } from "next";
import { fetchContentBySlug } from "@/lib/api";
import { WatchClient } from "@/components/pages/WatchClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

interface WatchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: WatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await fetchContentBySlug(slug);

  if (!content) {
    return {
      title: "Title Not Found",
      description: "We couldn't locate this title in the Flipss.id library.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${content.title} (${content.releaseYear})`;
  const url = absoluteUrl(`/watch/${content.slug}`);

  return {
    title,
    description: content.synopsis,
    keywords: [content.title, ...content.genres, ...content.cast, SITE_NAME],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} — Watch on ${SITE_NAME}`,
      description: content.synopsis,
      url,
      siteName: SITE_NAME,
      type: content.type === "movie" ? "video.movie" : "video.tv_show",
      images: [
        {
          url: content.backdropUrl,
          alt: content.title,
        },
        {
          url: content.posterUrl,
          alt: `${content.title} poster`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Watch on ${SITE_NAME}`,
      description: content.synopsis,
      images: [content.backdropUrl],
    },
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { slug } = await params;
  const content = await fetchContentBySlug(slug);

  const watchUrl = absoluteUrl(`/watch/${content?.slug || slug}`);

  const mediaSchema = content
    ? {
        "@context": "https://schema.org",
        "@type": content.type === "movie" ? "Movie" : "TVSeries",
        name: content.title,
        description: content.synopsis,
        url: watchUrl,
        image: [content.backdropUrl, content.posterUrl],
        datePublished: String(content.releaseYear),
        genre: content.genres,
        actor: content.cast.map((name) => ({
          "@type": "Person",
          name,
        })),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: content.imdbRating,
          bestRating: 10,
          worstRating: 1,
          ratingCount: 1000,
        },
        ...(content.type === "movie"
          ? { duration: `PT${content.durationMinutes}M` }
          : { numberOfEpisodes: content.episodes?.length || 1 }),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content?.type === "series" ? "Series" : "Browse",
        item: absoluteUrl(
          content?.type === "series" ? "/browse?type=series" : "/browse"
        ),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: content?.title || slug,
        item: watchUrl,
      },
    ],
  };

  return (
    <>
      {mediaSchema && <JsonLd data={mediaSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <WatchClient slug={slug} initialContent={content} />
    </>
  );
}
