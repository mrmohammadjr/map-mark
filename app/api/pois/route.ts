import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

const FILTERS: Record<string, string> = {
  hotel: `node["tourism"="hotel"]`,
  restaurant: `node["amenity"="restaurant"]`,
  gas_station: `node["amenity"="fuel"]`,
  shop: `node["shop"]`,
};

const DEFAULT_NAMES: Record<string, string> = {
  hotel: "Unnamed hotel",
  restaurant: "Unnamed restaurant",
  gas_station: "Gas station",
  shop: "Shop",
};

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category") ?? "";
  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  const r = Math.min(Number(sp.get("r")) || 3000, 5000);

  if (!FILTERS[category] || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const query = `[out:json][timeout:20];(${FILTERS[category]}(around:${r},${lat},${lng}););out 40;`;

  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "map-mark/1.0 (map-mark-mh.vercel.app)",
        },
        signal: AbortSignal.timeout(12000),
        cache: "no-store",
      });
      if (!res.ok) continue;

      const data = await res.json();
      const pois = (data.elements ?? [])
        .filter((el: any) => typeof el.lat === "number" && typeof el.lon === "number")
        .map((el: any) => ({
          id: el.id,
          name: el.tags?.name ?? DEFAULT_NAMES[category],
          category,
          position: { lat: el.lat, lng: el.lon },
        }));

      return NextResponse.json(pois);
    } catch {
      // این سرور جواب نداد، بعدی
    }
  }

  return NextResponse.json({ error: "Places service is busy" }, { status: 503 });
}
