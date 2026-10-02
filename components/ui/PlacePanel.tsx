
"use client";

import { useState } from "react";
import {
  Check,
  Clock,
  Copy,
  CornerUpRight,
  MapPin,
  Route as RouteIcon,
  Share2,
  X,
} from "lucide-react";

import { formatDistance, formatDuration } from "@/lib/format";
import type { AddressState } from "@/hooks/useReverseGeocode";
import type { LatLng, RouteInfo } from "@/types/types";

type Tab = "info" | "route";
type Flash = "copy" | "share" | null;

type Props = {
  point: LatLng;
  addressState: AddressState;
  canRoute: boolean;
  routeEnabled: boolean;
  route: RouteInfo | null;
  routeLoading: boolean;
  routeError: string | null;
  onToggleRoute: () => void;
  onClose: () => void;
};

function ActionButton({
  label,
  icon,
  onClick,
  primary = false,
  disabled = false,
  title,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="
        group flex flex-col items-center gap-1.5
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <span
        className={`
          flex h-12 w-14 items-center justify-center
          rounded-2xl
          border-2
          transition-all duration-200
          group-active:scale-95
          ${
            primary
              ? "border-green-600 bg-green-600 text-white shadow-sm group-hover:bg-green-700 group-hover:shadow-md"
              : "border-gray-200 bg-white text-gray-600 group-hover:border-green-600 group-hover:bg-green-50 group-hover:text-green-600"
          }
        `}
      >
        {icon}
      </span>

      <span
        className={`
          text-xs font-medium transition-colors
          ${
            primary
              ? "text-green-600"
              : "text-gray-500 group-hover:text-green-600"
          }
        `}
      >
        {label}
      </span>
    </button>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex items-start gap-3
        rounded-xl
        border border-gray-200
        bg-gray-50/50
        p-3
        transition-colors
        hover:border-gray-300
        hover:bg-gray-50
      "
    >
      <span
        className="
          mt-0.5
          flex h-8 w-8 shrink-0
          items-center justify-center
          rounded-lg
          bg-blue-50
          text-blue-600
        "
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-xs font-medium text-gray-500">
          {title}
        </p>

        <div className="break-words text-sm leading-5 text-gray-900">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function PlacePanel({
  point,
  addressState,
  canRoute,
  routeEnabled,
  route,
  routeLoading,
  routeError,
  onToggleRoute,
  onClose,
}: Props) {
  const [tab, setTab] = useState<Tab>("info");
  const [flash, setFlash] = useState<Flash>(null);

  const coordsText = `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`;

  const parts = addressState.address?.split(", ") ?? [];

  const title = addressState.loading
    ? "Finding address..."
    : parts[0] ?? "Selected point";

  const subtitle = addressState.loading
    ? ""
    : parts.slice(1).join(", ") || coordsText;

  function showFlash(type: Exclude<Flash, null>) {
    setFlash(type);
    setTimeout(() => setFlash(null), 1500);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(coordsText);
      showFlash("copy");
    } catch {
      // clipboard فقط روی HTTPS/localhost کار می‌کنه
    }
  }

  async function handleShare() {
    const { lat, lng } = point;

    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        showFlash("share");
      }
    } catch {
      // کاربر share رو کنسل کرده یا مرورگر اجازه نداده
    }
  }

  function handleDirections() {
    if (!routeEnabled) setTab("route");
    onToggleRoute();
  }

  const hint = "text-sm leading-5 text-gray-500 sm:col-span-2";

  return (
    <div
      dir="ltr"
      className="
        absolute bottom-8 left-3 right-3 z-[1000]
        max-h-[55dvh]
        overflow-y-auto
        rounded-2xl
        border border-gray-200
        bg-white
        text-gray-900
        shadow-[0_8px_30px_rgba(0,0,0,0.14)]
        sm:left-1/2
        sm:right-auto
        sm:w-[44rem]
        sm:max-w-[calc(100vw-2rem)]
        sm:-translate-x-1/2
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold leading-6 text-gray-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 truncate text-xs leading-5 text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            shrink-0
            rounded-full
            bg-gray-100
            p-1.5
            text-gray-500
            transition-all
            hover:bg-gray-200
            hover:text-gray-800
            active:scale-95
          "
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-3 flex border-b border-gray-200 px-4">
        {(["info", "route"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`
              -mb-px
              border-b-2
              px-4 py-2.5
              text-sm font-medium
              transition-colors
              ${
                tab === t
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }
            `}
          >
            {t === "info" ? "General info" : "Route"}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
        {/* Actions */}
        <div className="flex justify-around gap-3 sm:justify-start sm:gap-4">
          <ActionButton
            primary
            label={routeEnabled ? "Clear" : "Directions"}
            icon={
              routeEnabled ? <X size={22} /> : <CornerUpRight size={22} />
            }
            onClick={handleDirections}
            disabled={!canRoute}
            title={
              canRoute
                ? undefined
                : 'Tap "My location" first to enable directions'
            }
          />

          <ActionButton
            label={flash === "copy" ? "Copied!" : "Copy"}
            icon={
              flash === "copy" ? <Check size={22} /> : <Copy size={22} />
            }
            onClick={handleCopy}
          />

          <ActionButton
            label={flash === "share" ? "Link copied" : "Share"}
            icon={<Share2 size={22} />}
            onClick={handleShare}
          />
        </div>

        {/* Content */}
        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
          {tab === "info" && (
            <>
              <InfoCard
                icon={<MapPin size={18} />}
                title="Address"
              >
                {addressState.loading && "Finding address..."}

                {addressState.failed && "Address lookup failed."}

                {!addressState.loading &&
                  !addressState.failed &&
                  (addressState.address ??
                    "No address found for this point.")}
              </InfoCard>

              <InfoCard
                icon={<MapPin size={18} />}
                title="Coordinates"
              >
                <span className="font-mono text-xs">
                  {coordsText}
                </span>
              </InfoCard>
            </>
          )}

          {tab === "route" && (
            <>
              {!canRoute && (
                <p className={hint}>
                  Tap the &quot;My location&quot; button first, then press
                  Directions.
                </p>
              )}

              {canRoute && !routeEnabled && (
                <p className={hint}>
                  Press Directions to get a route from your location to
                  this point.
                </p>
              )}

              {routeEnabled && routeLoading && (
                <p className={hint}>Calculating route...</p>
              )}

              {routeEnabled && routeError && (
                <p className="text-sm leading-5 text-red-600 sm:col-span-2">
                  {routeError}
                </p>
              )}

              {routeEnabled && route && !routeLoading && (
                <>
                  <InfoCard
                    icon={<RouteIcon size={18} />}
                    title="Distance"
                  >
                    {formatDistance(route.distanceMeters)}
                  </InfoCard>

                  <InfoCard
                    icon={<Clock size={18} />}
                    title="Driving time"
                  >
                    {formatDuration(route.durationSeconds)}
                  </InfoCard>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

