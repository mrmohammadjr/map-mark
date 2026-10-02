import L from "leaflet";
import { POI_CATEGORIES } from "./poi-categories";
import type { PoiCategory } from "@/types/types";

const LABELS: Record<PoiCategory, string> = {
  hotel: "H",
  restaurant: "R",
  gas_station: "G",
  shop: "S",
};

export function getPoiIcon(category: PoiCategory): L.DivIcon {
  const meta = POI_CATEGORIES.find((c) => c.id === category);
  const color = meta?.color ?? "#6b7280";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:28px;height:28px;border-radius:50% 50% 50% 0;
        background:${color};transform:rotate(-45deg);
        border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);
        display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);color:white;font:700 12px/1 sans-serif;">
          ${LABELS[category]}
        </span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}