import { Location } from "@/models/interfaces";
import { getDistance, convertDistance } from "geolib";
import { calculateDistance } from "../helper";

export function filterLocations(
  lat: number,
  lng: number,
  locations: Partial<Location>[],
  radius: number
) {
  let filteredLocations: Partial<Location>[] = [];
  locations?.map((l) => {
    let distance = 0;

    if (l?.latitude && l?.longitude) {
      distance = getDistance(
        { lat, lng },
        {
          lat: l.latitude,
          lng: l.longitude,
        },
        0.01
      );
    }

    distance = convertDistance(distance, "mi");

    if (distance <= radius) {
      filteredLocations.push(l);
    }
  });

  let sortDistance = sortLocationsFromNearestToFarthest(
    { lat, lng },
    filteredLocations
  );

  return sortDistance;
}

function sortLocationsFromNearestToFarthest(
  point: { lat: number; lng: number },
  locations: Partial<Location>[]
) {
  if (!Array.isArray(locations) || !locations?.length) return [];

  const locationWithDistance = locations
    .filter(
      (location) =>
        location.latitude !== undefined && location.longitude !== undefined
    )
    .map((location) => {
      const distance = calculateDistance(
        point.lat,
        point.lng,
        Number(location.latitude),
        Number(location.longitude)
      );

      return { location, distance };
    });

  locationWithDistance.sort((a, b) => Number(a.distance) - Number(b.distance));

  return locationWithDistance.map((item) => item.location);
}
