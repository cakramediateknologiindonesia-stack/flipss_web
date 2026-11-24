import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { FlipsProvider } from "@/components/providers/FlipsContext";
import { ServiceWorkerRegistrar } from "@/components/providers/ServiceWorkerRegistrar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContentModal } from "@/components/streaming/ContentModal";
import { AuthModal } from "@/components/auth/AuthModal";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Flipss.id — Stream Movies, Originals & 4K Cinema",
  applicationName: "Flipss.id",
  description:
    "Watch Flipss Originals, blockbuster movies, and acclaimed series in 4K HDR. Flexible monthly & yearly streaming packages.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Flipss.id",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Flipss.id — Stream Movies, Originals & 4K Cinema",
    description:
      "Watch Flipss Originals, blockbuster movies, and acclaimed series in 4K HDR.",
    images: ["/images/flipss_splash.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#E50914] selection:text-white">
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
