export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  synopsis: string;
  durationMinutes: number;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface MediaContent {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  type: "movie" | "series";
  releaseYear: number;
  durationMinutes: number;
  maturityRating: string;
  imdbRating: number;
  matchPercent?: number;
  genres: string[];
  cast: string[];
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  videoUrl?: string;
  signedStreamUrl?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isOriginal?: boolean;
  requiredPackageTier?: number;
  episodes?: Episode[];
}

export interface StreamingPackage {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  resolution: string;
  maxDevices: number;
  downloadsAllowed: number;
  adsFree: boolean;
  tierLevel: number;
  features: string[];
  isPopular: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "user" | "admin";
}

export interface UserSubscription {
  id: string;
  packageId: string;
  billingCycle: "monthly" | "yearly";
  status: "active" | "cancelled" | "expired";
  startsAt: string;
  expiresAt: string;
  package?: StreamingPackage;
}
