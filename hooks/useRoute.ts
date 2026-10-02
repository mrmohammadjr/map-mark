"use client";

import { useEffect, useState } from "react";
import { fetchRoute } from "@/lib/routing";
import type { LatLng, RouteInfo } from "@/types/types";

export function useRoute(
  from: LatLng | null,
  to: LatLng | null,
  enabled: boolean
) {
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !from || !to) {
      return;
    }

    const controller = new AbortController();

    const loadRoute = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchRoute(
          from,
          to,
          controller.signal
        );

        setRoute(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        setRoute(null);
        setError((err as Error).message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadRoute();

    return () => {
      controller.abort();
    };
  }, [from, to, enabled]);

  return { route, loading, error };
}