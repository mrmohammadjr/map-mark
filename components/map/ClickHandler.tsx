"use client";

import { useMapEvents } from "react-leaflet";
import type { LatLng } from "@/types/types";

type Props = {
  onMapClick: (point: LatLng) => void;
};

export default function ClickHandler({ onMapClick }: Props) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return null;
}