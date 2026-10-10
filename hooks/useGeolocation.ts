"use client";

import { useCallback, useState } from "react";
import type { GeolocationState } from "@/types/types";

const initialState: GeolocationState = {
  status: "idle",
  position: null,
  accuracy: null,
  errorMessage: null,
};

function getPosition(options: PositionOptions) {
  return new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  );
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(initialState);

  const locate = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setState({
        ...initialState,
        status: "unavailable",
        errorMessage: "This browser does not support geolocation.",
      });
      return;
    }

    setState((prev) => ({ ...prev, status: "loading", errorMessage: null }));

    try {
      let pos: GeolocationPosition;
      try {
        pos = await getPosition({ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
      } catch (err) {
        if ((err as GeolocationPositionError).code === 1) throw err; // رد مجوز
        pos = await getPosition({ enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 });
      }

      setState({
        status: "success",
        position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        accuracy: pos.coords.accuracy,
        errorMessage: null,
      });
    } catch (e) {
      const err = e as GeolocationPositionError;
      let status: GeolocationState["status"] = "error";
      let errorMessage = "Could not get your location.";

      if (err.code === 1) {
        status = "denied";
        errorMessage =
          "Location permission is blocked. Allow it from the lock icon next to the address bar, then try again.";
      } else if (err.code === 2) {
        status = "unavailable";
        errorMessage =
          "Your device couldn't determine its location. Check that Location Services are on.";
      } else if (err.code === 3) {
        errorMessage = "Location request timed out. Please try again.";
      }

      setState((prev) => ({ ...prev, status, errorMessage }));
    }
  }, []);

  return { ...state, locate };
}
