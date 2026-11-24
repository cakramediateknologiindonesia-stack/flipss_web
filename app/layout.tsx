import type { Metadata } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { FlipsProvider } from "@/components/providers/FlipsContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContentModal } from "@/components/streaming/ContentModal";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "Flipss.id — Stream Movies, Originals & 4K Cinema",
  description:
    "Watch Flipss Originals, blockbuster movies, and acclaimed series in 4K HDR. Flexible monthly & yearly streaming packages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5f5f5] selection:bg-[#E50914] selection:text-white">
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
