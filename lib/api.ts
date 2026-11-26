import { FALLBACK_CONTENTS, FALLBACK_PACKAGES } from "./catalog";
import { MediaContent, StreamingPackage, UserProfile, UserSubscription } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.flipss.id";

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `API request failed (${res.status})`);
  }
  return json.data as T;
}

export async function fetchContents(params?: {
  type?: "movie" | "series";
  search?: string;
}): Promise<MediaContent[]> {
  try {
    const query = new URLSearchParams();
    if (params?.type) query.set("type", params.type);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    const data = await apiFetch<MediaContent[]>(`/contents${qs}`);
    if (Array.isArray(data) && data.length > 0) return data;
    throw new Error("Empty catalog");
  } catch {
    let items = [...FALLBACK_CONTENTS];
    if (params?.type) items = items.filter((i) => i.type === params.type);
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.synopsis.toLowerCase().includes(q) ||
          i.genres.some((g) => g.toLowerCase().includes(q))
      );
    }
    return items;
  }
}

export async function fetchContentBySlug(slug: string): Promise<MediaContent | null> {
  try {
    return await apiFetch<MediaContent>(`/contents/${slug}`);
  } catch {
    return FALLBACK_CONTENTS.find((c) => c.slug === slug || c.id === slug) || null;
  }
}

export async function fetchPackages(): Promise<StreamingPackage[]> {
  try {
    const data = await apiFetch<StreamingPackage[]>("/packages");
    if (Array.isArray(data) && data.length > 0) return data;
    throw new Error("Empty packages");
  } catch {
    return FALLBACK_PACKAGES;
  }
}

export async function loginUser(email: string, password: string) {
  return apiFetch<{ user: UserProfile & { activeSubscription?: UserSubscription }; token: string }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
}

export async function registerUser(name: string, email: string, password: string) {
  return apiFetch<{ user: UserProfile; token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function subscribeToPackage(
  packageId: string,
  billingCycle: "monthly" | "yearly",
  token: string
) {
  return apiFetch<UserSubscription>(
    "/subscriptions",
    {
      method: "POST",
      body: JSON.stringify({ packageId, billingCycle }),
    },
    token
  );
}

export async function syncWatchlistAdd(contentId: string, token: string) {
  return apiFetch("/watchlist", {
    method: "POST",
    body: JSON.stringify({ contentId }),
  }, token);
}

export async function syncWatchlistRemove(contentId: string, token: string) {
  return apiFetch(`/watchlist/${contentId}`, { method: "DELETE" }, token);
}
