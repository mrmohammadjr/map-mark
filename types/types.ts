export type LatLng = {
  lat: number;
  lng: number;
};

export type GeolocationStatus =
  | "idle"
  | "loading"
  | "success"
  | "denied"
  | "unavailable"
  | "error";

export type GeolocationState = {
  status: GeolocationStatus;
  position: LatLng | null;
  accuracy: number | null; // بر حسب متر
  errorMessage: string | null;
};

export type SearchResult = {
  id: number;
  displayName: string;
  position: LatLng;
};
export type RouteInfo = {
  coordinates: [number, number][]; // [lat, lng]
  distanceMeters: number;
  durationSeconds: number;
};
export type PoiCategory = "hotel" | "restaurant" | "gas_station" | "shop";

export type Poi = {
  id: number;
  name: string;
  category: PoiCategory;
  position: LatLng;
};

export type AccountInfo = {
  name: string;
  email: string;
};