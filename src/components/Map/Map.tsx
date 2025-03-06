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
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    if (props.locations?.length === 1) {
      const location = props.locations[0];
      setTimeout(() => {
        map.setCenter({ lat: location.lat, lng: location.lng });
        map.setZoom(17);
      }, 500);
    } else if (props.locations && props.locations.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      props.locations.forEach((loc) => bounds.extend(loc));
      map.fitBounds(bounds);
    }
  }, [props.locations]);

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
    <div className="google-map mob-setting h-full">
      {/* <GoogleMap
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
      </GoogleMap> */}
       <GoogleMap
        mapContainerStyle={{ ...DEFAULT_CONTAINER_STYLE, height: "100%" }}
        center={center}
        zoom={props?.zoomLevel || 10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {props.locations?.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: Number(location.lat), lng: Number(location.lng) }}
            icon={{ url: "/img/locate.svg" }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
