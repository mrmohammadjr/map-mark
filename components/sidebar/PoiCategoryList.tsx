"use client";

import { Fuel, Hotel, Store, UtensilsCrossed } from "lucide-react";
import { POI_CATEGORIES } from "@/lib/poi-categories";
import type { PoiCategory } from "@/types/types";

const ICONS: Record<PoiCategory, React.ElementType> = {
  hotel: Hotel,
  restaurant: UtensilsCrossed,
  gas_station: Fuel,
  shop: Store,
};

type Props = {
  selected: PoiCategory | null;
  hasUserLocation: boolean;
  loading: boolean;
  error: string | null;
  resultCount: number;
  onSelect: (category: PoiCategory) => void;
  onRequestLocation: () => void;
};

export default function PoiCategoryList({
  selected,
  hasUserLocation,
  loading,
  error,
  resultCount,
  onSelect,
  onRequestLocation,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Nearby places
      </p>

      {!hasUserLocation && (
        <div className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          <p className="mb-2">Enable your location to see places around you.</p>
          <button
            type="button"
            onClick={onRequestLocation}
            className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
          >
            Enable location
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {POI_CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.id];
          const active = selected === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              disabled={!hasUserLocation}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                active
                  ? "border-transparent text-white"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              style={active ? { backgroundColor: cat.color } : undefined}
            >
              <Icon size={20} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {selected && hasUserLocation && (
        <div className="mt-3 text-xs text-gray-500">
          {loading && "Searching nearby..."}
          {error && <span className="text-red-600">{error}</span>}
          {!loading && !error && (
            <span>
              {resultCount} {resultCount === 1 ? "place" : "places"} found nearby
            </span>
          )}
        </div>
      )}
    </div>
  );
}