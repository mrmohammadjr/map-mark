"use client";

import { useState } from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";

import ClickHandler from "./ClickHandler";
import FlyToController from "./FlyToController";
import PointMarker from "./PointMarker";
import PoiMarkers from "./PoiMarkers";
import RouteLayer from "./RouteLayer";
import UserLocationMarker from "./UserLocationMarker";
import LocateButton from "@/components/ui/LocateButton";
import PlacePanel from "@/components/ui/PlacePanel";
import SearchBox from "@/components/ui/SearchBox";
import SidebarToggle from "@/components/ui/SidebarToggle";
import Sidebar from "@/components/sidebar/Sidebar";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { useRoute } from "@/hooks/useRoute";
import { usePois } from "@/hooks/usePois";

import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  TILE_ATTRIBUTION,
  TILE_URL,
} from "@/lib/constants";
import type { AccountInfo, LatLng, PoiCategory, SearchResult } from "@/types/types";

// بعداً این رو با اطلاعات واقعی auth جایگزین کن
const DUMMY_ACCOUNT: AccountInfo = {
  name: "Guest User",
  email: "guest@example.com",
};

export default function MapContainer() {
  const [selectedPoint, setSelectedPoint] = useState<LatLng>(DEFAULT_CENTER);
  const [flyTarget, setFlyTarget] = useState<LatLng | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [routeEnabled, setRouteEnabled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PoiCategory | null>(
    null
  );

  const {
    status,
    position: userPosition,
    accuracy,
    errorMessage,
    locate,
  } = useGeolocation();

  const addressState = useReverseGeocode(panelOpen ? selectedPoint : null);
  const {
    route,
    loading: routeLoading,
    error: routeError,
  } = useRoute(userPosition, selectedPoint, routeEnabled);
  const { pois, loading: poisLoading, error: poisError } = usePois(
    selectedCategory,
    userPosition
  );

  function handleMapClick(point: LatLng) {
    setSelectedPoint(point);
    setPanelOpen(true);
  }

  function handleSearchSelect(result: SearchResult) {
    setSelectedPoint(result.position);
    setFlyTarget({ ...result.position });
    setPanelOpen(true);
  }

  function handleClosePanel() {
    setPanelOpen(false);
    setRouteEnabled(false);
  }

  function handleSelectCategory(category: PoiCategory) {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }

  return (
    <div className="relative h-full w-full">
      <LeafletMap
        center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <ClickHandler onMapClick={handleMapClick} />
        <FlyToController target={flyTarget} />
        <RouteLayer route={route} />
        <PoiMarkers pois={pois} />
        <PointMarker position={selectedPoint} />
        <UserLocationMarker position={userPosition} accuracy={accuracy} />
      </LeafletMap>

      <SidebarToggle onClick={() => setSidebarOpen(true)} />
      <SearchBox onSelect={handleSearchSelect} />
      <LocateButton status={status} errorMessage={errorMessage} onClick={locate} />

      {panelOpen && (
        <PlacePanel
          point={selectedPoint}
          addressState={addressState}
          canRoute={userPosition !== null}
          routeEnabled={routeEnabled}
          route={route}
          routeLoading={routeLoading}
          routeError={routeError}
          onToggleRoute={() => setRouteEnabled((v) => !v)}
          onClose={handleClosePanel}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        account={DUMMY_ACCOUNT}
        selectedCategory={selectedCategory}
        hasUserLocation={userPosition !== null}
        poisLoading={poisLoading}
        poisError={poisError}
        poiCount={pois.length}
        onSelectCategory={handleSelectCategory}
        onRequestLocation={locate}
      />
    </div>
  );
}