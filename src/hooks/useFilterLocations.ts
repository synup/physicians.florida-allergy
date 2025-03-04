"use client";
import { useState, useCallback } from "react";
import { Location } from "@/models/interfaces";
import sendRequest from "@/lib/services/axios";

export const useFilterLocations = () => {
  const [filterLocations, setFilterLocations] = useState<Partial<Location>[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilterLocations = useCallback(
    async ({
      lat,
      lng,
      city,
      state,
    }: {
      lat?: number;
      lng?: number;
      city?: string;
      state?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        let searchOptions = {};
        if (lat) {
          searchOptions = {
            lat,
            lng,
            city,
            state,
          };
        }
        const res: any = await sendRequest("/filter-locations", "GET", searchOptions);
        if (res?.locations) {
          setFilterLocations(res.locations);
        } else {
          setError("No locations found");
        }
      } catch (err) {
        setError("Error fetching locations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { filterLocations, loading, error, fetchFilterLocations };
};
