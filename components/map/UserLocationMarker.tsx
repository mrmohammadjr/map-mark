"use client";

import { useEffect } from "react";
import { Circle, Marker, Popup, useMap } from "react-leaflet";
import { userMarkerIcon } from "@/lib/leaflet-icons";
import { USER_LOCATION_ZOOM } from "@/lib/constants";
import type { LatLng } from "@/types/types";

type Props = {
  position: LatLng | null;
  accuracy: number | null;
};

export default function UserLocationMarker({ position, accuracy }: Props) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], USER_LOCATION_ZOOM, {
        duration: 1.5,
      });
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <>
      {accuracy !== null && (
        <Circle
          center={[position.lat, position.lng]}
          radius={accuracy}
          pathOptions={{
            color: "#000000",
            weight: 1,
            fillColor: "#000000",
            fillOpacity: 0.12,
          }}
          interactive={false}
        />
      )}
      <Marker
        position={[position.lat, position.lng]}
        icon={userMarkerIcon}
        draggable={false}
      >
        <Popup>
          <div dir="ltr">
            <strong>You are here</strong>
            {accuracy !== null && <p>Accuracy: ±{Math.round(accuracy)} m</p>}
          </div>
        </Popup>
      </Marker>
    </>
  );
}