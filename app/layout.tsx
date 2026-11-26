import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { FlipsProvider } from "@/components/providers/FlipsContext";
import { ServiceWorkerRegistrar } from "@/components/providers/ServiceWorkerRegistrar";
import { Navbar } from "@/components/layout/Navbar";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { Footer } from "@/components/layout/Footer";
import { ContentModal } from "@/components/streaming/ContentModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
  buildDefaultOgImages,
  getSiteUrl,
} from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Flipss",
    "Flipss.id",
    "streaming",
    "Indonesian movies",
    "Flipss Originals",
    "1080p Full HD streaming",
    "watch movies online",
    "original series",
  ],
  authors: [{ name: SITE_NAME, url: getSiteUrl() }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: buildDefaultOgImages(DEFAULT_TITLE),
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: absoluteUrl("/icons/icon-512x512.png"),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/browse?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#E50914] selection:text-white">
        <SplashScreen />
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <ServiceWorkerRegistrar />
        <LenisProvider>
          <FlipsProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ContentModal />
            <AuthModal />
          </FlipsProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
