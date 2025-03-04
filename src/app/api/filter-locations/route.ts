import { NextRequest, NextResponse } from "next/server";
import { fetchLocations } from "@/lib/services/gql";
import { RADIUS_THRESHOLD } from "@/lib/helper";
import { filterLocations } from "@/lib/services/location-services";
import { Location } from "@/models/interfaces";
const fs = require('fs');
const path = require('path');


export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const lat = req.nextUrl.searchParams?.get("lat");
    const lng = req.nextUrl.searchParams?.get("lng");
    const city = req.nextUrl.searchParams?.get("city")?.trim()?.toLowerCase();
    const state = req.nextUrl.searchParams?.get("state")?.trim()?.toLowerCase();

    const allLocations = await fetchLocations();

    if (lat) {

      if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
        return NextResponse.json(
          { locations: [], error: "Invalid latitude or longitude" },
          { status: 400 }
        );
      }

      const numLat = Number(lat);
      const numLng = Number(lng);

      if (numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) {
        return NextResponse.json(
          { locations: [], error: "Latitude or longitude out of valid range" },
          { status: 400 }
        );
      }

      if (!Array.isArray(allLocations) || allLocations.length === 0) {
        return NextResponse.json(
          { locations: [], error: "No locations found" },
          { status: 404 }
        );
      }

      let filteredLocations = filterLocations(
        Number(lat),
        Number(lng),
        allLocations as Partial<Location>[],
        RADIUS_THRESHOLD
      );

      if (filteredLocations.length === 0 && city) {
        filteredLocations = allLocations.filter((location: Partial<Location>) => {
          return location.city?.trim()?.toLowerCase() === city;
        });
      }

      if (filteredLocations.length === 0 && state) {
        filteredLocations = allLocations.filter((location: Partial<Location>) => {
          return location.stateIso?.trim()?.toLowerCase() === state;
        });
      }

      return NextResponse.json({ locations: filteredLocations });

    } else {

      return NextResponse.json({ locations: allLocations });

    }

  } catch (error) {
    console.error(
      `API::filterLocations==> Error: ${error instanceof Error ? error.message : String(error)
      }`
    );
    return NextResponse.json(
      { locations: [], error: "Internal server error" },
      { status: 500 }
    );
  }
}
