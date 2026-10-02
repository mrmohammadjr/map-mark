import type { LatLng, Poi, PoiCategory } from "@/types/types";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const CATEGORY_FILTERS: Record<PoiCategory, string> = {
  hotel: `node["tourism"="hotel"](around:{r},{lat},{lng});`,
  restaurant: `node["amenity"="restaurant"](around:{r},{lat},{lng});`,
  gas_station: `node["amenity"="fuel"](around:{r},{lat},{lng});`,
  shop: `node["shop"](around:{r},{lat},{lng});`,
};

const DEFAULT_NAMES: Record<PoiCategory, string> = {
  hotel: "Unnamed hotel",
  restaurant: "Unnamed restaurant",
  gas_station: "Gas station",
  shop: "Shop",
};

type OverpassElement = {
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements: OverpassElement[];
};

export async function fetchPois(
  category: PoiCategory,
  center: LatLng,
  radiusMeters: number,
  signal?: AbortSignal
): Promise<Poi[]> {
  const filter = CATEGORY_FILTERS[category]
    .replace("{r}", String(radiusMeters))
    .replace("{lat}", String(center.lat))
    .replace("{lng}", String(center.lng));

  const query = `[out:json][timeout:25];(${filter});out 40;`;

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    signal,
  });

  if (!res.ok) throw new Error("Failed to load nearby places");

  const data: OverpassResponse = await res.json();

  return data.elements
    .filter((el) => typeof el.lat === "number" && typeof el.lon === "number")
    .map((el) => ({
      id: el.id,
      name: el.tags?.name ?? DEFAULT_NAMES[category],
      category,
      position: { lat: el.lat, lng: el.lon },
    }));
}