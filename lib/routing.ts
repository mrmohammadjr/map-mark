import type { LatLng, RouteInfo } from "@/types/types";

type OsrmResponse = {
  code: string;
  routes?: {
    distance: number;
    duration: number;
    geometry: { coordinates: [number, number][] };
  }[];
};

export async function fetchRoute(
  from: LatLng,
  to: LatLng,
  signal?: AbortSignal
): Promise<RouteInfo> {
  // OSRM مختصات رو به صورت lng,lat می‌گیره (برعکس Leaflet)
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Routing request failed");

  const data: OsrmResponse = await res.json();
  const route = data.routes?.[0];
  if (data.code !== "Ok" || !route) throw new Error("No route found");

  return {
    coordinates: route.geometry.coordinates.map(
      ([lng, lat]): [number, number] => [lat, lng]
    ),
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}