"use client";

import { useCallback, useState } from "react";
import type { GeolocationState } from "@/types/types";

const initialState: GeolocationState = {
  status: "idle",
  position: null,
  accuracy: null,
  errorMessage: null,
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(initialState);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState({
        ...initialState,
        status: "unavailable",
        errorMessage: "This browser does not support geolocation.",
      });
      return;
    }

    setState((prev) => ({ ...prev, status: "loading", errorMessage: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: "success",
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          accuracy: pos.coords.accuracy,
          errorMessage: null,
        });
      },
      (err) => {
        let status: GeolocationState["status"] = "error";
        let errorMessage = "Could not get your location.";

        if (err.code === err.PERMISSION_DENIED) {
          status = "denied";
          errorMessage = "Location permission was denied.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          status = "unavailable";
          errorMessage = "Location information is unavailable.";
        } else if (err.code === err.TIMEOUT) {
          errorMessage = "Location request timed out.";
        }

        setState((prev) => ({ ...prev, status, errorMessage }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { ...state, locate };
}