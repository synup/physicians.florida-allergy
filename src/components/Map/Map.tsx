"use client";
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { DEFAULT_LOCATION, DEFAULT_CONTAINER_STYLE } from "@/lib/helper";
import { useGoogleMaps } from "@/context/GoogleMapsContext";
import { LatLng } from "use-places-autocomplete";

export type typeLatCustom = {
  lat: number;
  lng: number;
  name?: string;
  slug?: string;
};

export type MapProps = {
  center?: LatLng;
  locations?: typeLatCustom[];
  zoomLevel: number;
  focussedMarkerIndex?: number;
  onLocationClick?: (locationIndex: number) => void;
};
const Map = (props: MapProps) => {
  // Context
  const { isLoaded, loadError } = useGoogleMaps();

  // Map Center
  const center = props?.center || DEFAULT_LOCATION;

  // States
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // On Map Load
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  // On Map Unmount
  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // Effects
  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(props?.zoomLevel || 10);
    }
  }, [map, center, props.zoomLevel]);

  if (loadError) {
    return <div>Error loading Google Maps: {loadError.message}</div>;
  }
  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div className="google-map h-full">
      <GoogleMap
        mapContainerStyle={DEFAULT_CONTAINER_STYLE}
        center={center}
        zoom={props?.zoomLevel || 10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {Array.isArray(props.locations) && props.locations.length ? (
          props.locations?.map((location, locationIndex) => {
            return (
              <Marker
                key={locationIndex}
                position={{
                  lat: Number(location.lat),
                  lng: Number(location.lng),
                }}
                icon={{
                  url: "/img/locate.svg",
                }}
              />
            );
          })
        ) : (
          <></>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
