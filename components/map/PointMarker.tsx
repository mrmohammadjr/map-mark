"use client";

import { Marker, Popup } from "react-leaflet";
import { defaultMarkerIcon } from "@/lib/leaflet-icons";
import type { LatLng } from "@/types/types";

type Props = {
  position: LatLng;
};

export default function PointMarker({ position }: Props) {
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={defaultMarkerIcon}
      draggable={false}
    >
      <Popup>
        <div dir="ltr">
          <p>Lat: {position.lat.toFixed(6)}</p>
          <p>Lng: {position.lng.toFixed(6)}</p>
        </div>
      </Popup>
    </Marker>
  );
}