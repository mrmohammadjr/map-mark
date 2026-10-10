import type { LatLng, Poi, PoiCategory } from "@/types/types";

export async function fetchPois(
  category: PoiCategory,
  center: LatLng,
  radiusMeters: number,
  signal?: AbortSignal
): Promise<Poi[]> {
  const params = new URLSearchParams({
    category,
    lat: String(center.lat),
    lng: String(center.lng),
    r: String(radiusMeters),
  });

  const res = await fetch(`/api/pois?${params}`, { signal });
  if (!res.ok) throw new Error("Nearby places are busy right now, try again.");

  return res.json();
}
