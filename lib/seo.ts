import type { Metadata } from "next";

export const SITE_NAME = "Flipss.id";
export const DEFAULT_TITLE = "Flipss.id — Stream Movies, Originals & 4K Cinema";
export const DEFAULT_DESCRIPTION =
  "Watch Flipss Originals, blockbuster movies, and acclaimed series in 4K HDR. Flexible monthly & yearly streaming packages.";
export const DEFAULT_OG_IMAGE = "/images/flipss_splash.png";
export const SQUARE_LOGO_IMAGE = "/images/flipss_logo.png";

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    "https://flipss.id";
  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildDefaultOgImages(alt: string, image = DEFAULT_OG_IMAGE) {
  const mainUrl = absoluteUrl(image);
  const logoUrl = absoluteUrl(SQUARE_LOGO_IMAGE);

  const images = [
    {
      url: mainUrl,
      secureUrl: mainUrl,
      width: 1200,
      height: 630,
      type: "image/png",
      alt,
    },
  ];

  if (image === DEFAULT_OG_IMAGE) {
    images.push({
      url: logoUrl,
      secureUrl: logoUrl,
      width: 500,
      height: 500,
      type: "image/png",
      alt: `${SITE_NAME} Logo`,
    });
  }

  return images;
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: buildDefaultOgImages(title, image),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
