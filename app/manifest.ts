import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flipss.id — Stream Movies, Originals & 4K Cinema",
    short_name: "Flipss.id",
    description:
      "Watch Flipss Originals, blockbuster movies, and acclaimed series in 4K HDR. Flexible monthly & yearly streaming packages.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#000000",
    theme_color: "#000000",
    categories: ["entertainment", "video"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/images/flipss_splash.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "Flipss.id 4K Streaming",
      },
    ],
  };
}
