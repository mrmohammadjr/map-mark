"use client";

import { useState } from "react";
import { formatDistance, formatDuration } from "@/lib/format";
import type { AddressState } from "@/hooks/useReverseGeocode";
import type { LatLng, RouteInfo } from "@/types/types";

type Props = {
  point: LatLng | null;
  addressState: AddressState;
  canRoute: boolean;
  routeEnabled: boolean;
  route: RouteInfo | null;
  routeLoading: boolean;
  routeError: string | null;
  onToggleRoute: () => void;
};

export default function CoordinatesPanel({
  point,
  addressState,
  canRoute,
  routeEnabled,
  route,
  routeLoading,
  routeError,
  onToggleRoute,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!point) return;
    try {
      await navigator.clipboard.writeText(
        `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard فقط روی HTTPS/localhost کار می‌کنه
    }
  }

  return (
    <div
      dir="ltr"
      className="absolute inset-x-3 bottom-8 z-[1000] rounded-xl bg-white/95 p-3 text-sm text-gray-900 shadow-lg sm:inset-x-auto sm:left-4 sm:w-80"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="mb-1 font-semibold">Selected point</p>
          {point ? (
            <p className="font-mono text-xs">
              {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
            </p>
          ) : (
            <p className="text-gray-500">Click on the map to pick a point</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!point}
          className="shrink-0 rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {point && (
        <p className="mt-2 line-clamp-2 text-xs text-gray-600">
          {addressState?.loading && "Finding address..."}
          {addressState?.failed && "Address lookup failed."}
          {!addressState?.loading &&
            !addressState?.failed &&
            (addressState?.address ?? "No address found for this point.")}
        </p>
      )}

      <div className="mt-3 border-t border-gray-200 pt-3">
        <button
          type="button"
          onClick={onToggleRoute}
          disabled={!canRoute || !point}
          className="w-full rounded-md bg-violet-600 px-3 py-2 text-xs font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {routeEnabled ? "Clear route" : "Directions from my location"}
        </button>

        {!canRoute && (
          <p className="mt-2 text-xs text-gray-500">
            Tap &quot;My location&quot; first to enable directions.
          </p>
        )}
        {routeEnabled && routeLoading && (
          <p className="mt-2 text-xs text-gray-500">Calculating route...</p>
        )}
        {routeEnabled && routeError && (
          <p className="mt-2 text-xs text-red-600">{routeError}</p>
        )}
        {routeEnabled && route && !routeLoading && (
          <p className="mt-2 text-xs font-medium">
            {formatDistance(route.distanceMeters)} ·{" "}
            {formatDuration(route.durationSeconds)} (driving)
          </p>
        )}
      </div>
    </div>
  );
}