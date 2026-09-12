// src/lib/pixabay/api.ts

import type { PixabayImage, PixabaySearchResponse } from "./types";

const API_BASE = "https://pixabay.com/api";
const API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;

if (!API_KEY) {
  console.warn("Pixabay API key is not configured");
}

interface PixabaySearchParams {
  query: string;
  page?: number;
  perPage?: number;
  imageType?: "vector" | "illustration" | "photo";
  category?: string;
  colors?: string;
  orderBy?: "popular" | "latest";
}

export async function searchPixabay({
  query,
  page = 1,
  perPage = 24,
  imageType = "vector",
  category,
  colors,
  orderBy = "popular",
}: PixabaySearchParams): Promise<PixabaySearchResponse> {
  if (!query.trim()) {
    return { total: 0, totalHits: 0, hits: [] };
  }

  if (!API_KEY) {
    console.error("Pixabay API key is missing");
    return { total: 0, totalHits: 0, hits: [] };
  }

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: imageType,
    page: page.toString(),
    per_page: perPage.toString(),
    order: orderBy,
  });

  if (category) params.append("category", category);
  if (colors) params.append("colors", colors);

  try {
    const response = await fetch(`${API_BASE}/?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }

    const data: PixabaySearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Pixabay search error:", error);
    return { total: 0, totalHits: 0, hits: [] };
  }
}

export async function getImageDetails(id: number): Promise<PixabayImage | null> {
  if (!API_KEY) return null;

  try {
    const response = await fetch(
      `${API_BASE}/?key=${API_KEY}&id=${id}&image_type=vector`
    );
    if (!response.ok) return null;
    const data: PixabaySearchResponse = await response.json();
    return data.hits[0] || null;
  } catch (error) {
    console.error("Pixabay details error:", error);
    return null;
  }
}

export const CATEGORIES = [
  "backgrounds",
  "fashion",
  "nature",
  "science",
  "education",
  "feelings",
  "health",
  "people",
  "religion",
  "places",
  "animals",
  "industry",
  "computer",
  "food",
  "sports",
  "transportation",
  "travel",
  "buildings",
  "business",
  "music",
];

export const COLORS = [
  "grayscale",
  "transparent",
  "red",
  "orange",
  "yellow",
  "green",
  "turquoise",
  "blue",
  "lilac",
  "pink",
  "white",
  "gray",
  "black",
  "brown",
];
