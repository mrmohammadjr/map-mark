import type { LatLng } from "@/types/types";

// مرکز پیش‌فرض نقشه (باکو). هر مختصاتی خواستی می‌تونی بذاری
export const DEFAULT_CENTER: LatLng = { lat: 40.4093, lng: 49.8671 };
export const DEFAULT_ZOOM = 12;
export const USER_LOCATION_ZOOM = 16;

export const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
export const POI_SEARCH_RADIUS_METERS = 3000;

export const APP_NAME = "Map Mark"; // اسم برنامه‌ت رو اینجا بذار
export const CREATOR_NAME = "Mohammad Javad Rasooli"; // TODO: اسم خودت رو جایگزین کن
export const TECH_STACK = [
  "Next.js",
  "TypeScript",
  "Leaflet",
  "OpenStreetMap",
  "Tailwind CSS",
];