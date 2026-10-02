import type { SearchResult } from "@/types/types";
import type { LatLng } from "@/types/types";

type NominatimItem = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export async function searchAddress(query: string): Promise<SearchResult[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Search request failed");

  const data: NominatimItem[] = await res.json();

  return data.map((item) => ({
    id: item.place_id,
    displayName: item.display_name,
    position: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
  }));
}
export async function reverseGeocode(
  point: LatLng,
  signal?: AbortSignal
): Promise<string | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(point.lat));
  url.searchParams.set("lon", String(point.lng));
  url.searchParams.set("format", "jsonv2");

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error("Reverse geocoding failed");

  const data: { display_name?: string } = await res.json();
  return data.display_name ?? null;
}