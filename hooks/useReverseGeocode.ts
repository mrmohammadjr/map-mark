"use client";

import { useEffect, useState } from "react";
import { reverseGeocode } from "@/lib/geocoding";
import type { LatLng } from "@/types/types";

export type AddressState = {
  address: string | null;
  loading: boolean;
  failed: boolean;
};

export function useReverseGeocode(
  point: LatLng | null,
  delay = 600
) {
  const [state, setState] = useState<AddressState>({
    address: null,
    loading: false,
    failed: false,
  });

  useEffect(() => {
    if (!point) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setState((prev) => ({
        ...prev,
        loading: true,
        failed: false,
      }));

      try {
        const address = await reverseGeocode(
          point,
          controller.signal
        );

        setState({
          address,
          loading: false,
          failed: false,
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        setState({
          address: null,
          loading: false,
          failed: true,
        });
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [point, delay]);

  return state;
}