"use client";

import { useEffect } from "react";
import { Polyline, useMap } from "react-leaflet";
import type { RouteInfo } from "@/types/types";

type Props = {
  route: RouteInfo | null;
};

export default function RouteLayer({ route }: Props) {
  const map = useMap();

  useEffect(() => {
    if (route && route.coordinates.length > 1) {
      // padding بالا/پایین برای اینکه مسیر زیر سرچ و پنل پایین نره
      map.fitBounds(route.coordinates, {
        paddingTopLeft: [40, 110],
        paddingBottomRight: [40, 300],
      });
    }
  }, [route, map]);

  if (!route) return null;

  return (
    <Polyline
      positions={route.coordinates}
      pathOptions={{ color: "#7c3aed", weight: 5, opacity: 0.85 }}
      interactive={false}
    />
  );
}
