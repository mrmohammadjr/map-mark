"use client";

import { Marker, Popup } from "react-leaflet";
import { getPoiIcon } from "@/lib/poi-icons";
import type { Poi } from "@/types/types";

type Props = {
  pois: Poi[];
};

export default function PoiMarkers({ pois }: Props) {
  return (
    <>
      {pois.map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.position.lat, poi.position.lng]}
          icon={getPoiIcon(poi.category)}
        >
          <Popup>
            <div dir="ltr">
              <strong>{poi.name}</strong>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}