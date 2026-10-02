"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLng } from "@/types/types";

type Props = {
  target: LatLng | null;
  zoom?: number;
};

export default function FlyToController({ target, zoom = 15 }: Props) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], zoom, { duration: 1.5 });
    }
  }, [target, zoom, map]);

  return null;
}