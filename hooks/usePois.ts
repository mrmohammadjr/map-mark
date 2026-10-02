"use client";

import { useEffect, useState } from "react";
import { fetchPois } from "@/lib/overpass";
import { POI_SEARCH_RADIUS_METERS } from "@/lib/constants";
import type { LatLng, Poi, PoiCategory } from "@/types/types";

export function usePois(
  category: PoiCategory | null,
  center: LatLng | null
) {
  const [pois, setPois] = useState<Poi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category || !center) {
      return;
    }

    const controller = new AbortController();

    const loadPois = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPois(
          category,
          center,
          POI_SEARCH_RADIUS_METERS,
          controller.signal
        );

        setPois(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        setPois([]);
        setError((err as Error).message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadPois();

    return () => {
      controller.abort();
    };
  }, [category, center]);

  return { pois, loading, error };
}