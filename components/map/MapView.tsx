"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("./MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
     loading ...
    </div>
  ),
});

export default function MapView() {
  return <MapContainer />;
}