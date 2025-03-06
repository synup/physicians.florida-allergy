"use client";
import Map from "./Map";
import { Location } from "@/models/interfaces";
import { getLocationSlug } from "@/lib/helper";
import { GoogleMapsProvider } from "@/context/GoogleMapsContext";

export type LocationDetailsDynamicWrapperProps = {
  location: Partial<Location>;
};

function SingleLocationMap(props: LocationDetailsDynamicWrapperProps) {
  // console.log('SingleLocationMap', Number(props?.location?.latitude),Number(props?.location?.longitude));
  const latitude = Number(props?.location?.latitude) 
  const longitude = Number(props?.location?.longitude)

  // Apply a slight latitude offset to keep the marker centered visually
  const adjustedCenter = { lat: latitude - 0.0005, lng: longitude };
  return (
    <GoogleMapsProvider>
      <div className="h-[300px] md:h-[300px] overflow-hidden map right-map">
        <Map
        center={adjustedCenter}
          locations={[
            {
              lat: Number(props?.location?.latitude),
              lng: Number(props?.location?.longitude),
              name: props?.location?.name,
              slug: getLocationSlug(props?.location),
            },
          ]}
          zoomLevel={17}
          focussedMarkerIndex={-1}
        />
      </div>
    </GoogleMapsProvider>
  );
}

export default SingleLocationMap;
