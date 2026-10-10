import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
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

type Element = { id: number; lat?: number; lon?: number; tags?: Record<string, string> };

async function queryEndpoint(url: string, query: string, signal: AbortSignal) {
  const host = new URL(url).host;
  const res = await fetch(url, {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "User-Agent": "map-mark/1.0 (https://map-mark-mh.vercel.app)",
    },
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${host}: HTTP ${res.status}`);

  const text = await res.text();
  try {
    return JSON.parse(text) as { elements?: Element[] };
  } catch {
    // گاهی Overpass با status 200 یک صفحه خطای HTML می‌ده
    throw new Error(`${host}: invalid JSON (${text.slice(0, 80)})`);
  }
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category") ?? "";
  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  const r = Math.min(Number(sp.get("r")) || 3000, 5000);

  if (!FILTERS[category] || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const query = `[out:json][timeout:15];(${FILTERS[category]}(around:${r},${lat},${lng}););out 40;`;

  const controller = new AbortController();
  const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]);

  try {
    // هر سرور زودتر جواب داد همون رو می‌گیریم
    const data = await Promise.any(
      ENDPOINTS.map((url) => queryEndpoint(url, query, signal))
    );
    controller.abort();

    const pois = (data.elements ?? [])
      .filter((el) => typeof el.lat === "number" && typeof el.lon === "number")
      .map((el) => ({
        id: el.id,
        name: el.tags?.name ?? DEFAULT_NAMES[category],
        category,
        position: { lat: el.lat as number, lng: el.lon as number },
      }));

    return NextResponse.json(pois);
  } catch (e) {
    const details =
      e instanceof AggregateError
        ? e.errors.map((x) => String((x as Error).message ?? x))
        : [String(e)];
    console.error("POI fetch failed:", details);
    return NextResponse.json(
      { error: "Places service is busy", details },
      { status: 503 }
    );
  }
}
