"use client";

import { useState, useEffect } from "react";
import PlacesSearch from "../PlacesSearch/PlacesSearch";
import Map from "../Map/Map";
import {
  DEFAULT_LOCATION,
  getCenterPosition,
  getLocationSlug,
} from "@/lib/helper";
import PhysicianResult from "./PhysicianResult";
import { useFilterLocations } from "@/hooks/useFilterLocations";

const Physician = () => {
  // Hook
  const { filterLocations, loading, error, fetchFilterLocations } = useFilterLocations();

  // States
  const [center, setCenter] = useState(DEFAULT_LOCATION);
  const [searchPlace, setSearchPlace] = useState({
    lat: 0,
    lng: 0,
    city: "",
    state: "",
  });

  const [focusedLocationIndex, setFocusedLocationIndex] = useState(-1);

  console.log(filterLocations)

  // Effect
  useEffect(() => {
    if (filterLocations.length > 0) {
      const locationLatLngArr = filterLocations.map((filterLocation) => {
        return {
          lat: Number(filterLocation.latitude),
          lng: Number(filterLocation.longitude),
        };
      });
      const currentCenter = getCenterPosition(locationLatLngArr);
      setCenter(currentCenter);
    } else {
      setCenter({
        lat: searchPlace.lat,
        lng: searchPlace.lng,
      });
    }
  }, [filterLocations]);

  // Handlers
  const placesSearchHandler = async (searchPlace: any) => {
    if (searchPlace && searchPlace.lat && searchPlace.lng) {
      setSearchPlace({
        lat: searchPlace.lat,
        lng: searchPlace.lng,
        city: searchPlace.city,
        state: searchPlace.state,
      });
      fetchFilterLocations({
        lat: searchPlace.lat,
        lng: searchPlace.lng,
        city: searchPlace.city,
        state: searchPlace.state,
      });
    }
  };

  useEffect(() => {
    fetchFilterLocations({});
  }, []);

  return (
    <>
      <div className="md:flex items-stretch px-[15px]">
        {/* Left Section */}
        <div className="flex flex-col md:w-[500px] max-h-[100vh] pr-2">
          <div className="bg-white rounded-2xl ">
            <h2 className="text-[24px] text-[#373A3C] font-bold my-[8px]">
              Find a Physician near you
            </h2>
            {/* PlacesSearch */}
            {<PlacesSearch onSubmit={placesSearchHandler} />}
          </div>
          {/* Scrollable List */}
          <PhysicianResult
            locations={filterLocations}
            searchPlace={searchPlace}
            loading={loading}
            onLocationHover={setFocusedLocationIndex}
          />
        </div>
        {/* Map Section */}
        <div className=" flex-1  -mx-[15px] md:mx-[0]">
          <Map
            center={center}
            locations={filterLocations.map((loc) => ({
              lat: Number(loc?.latitude),
              lng: Number(loc.longitude),
              name: loc?.name,
              slug: getLocationSlug(loc),
            }))}
            zoomLevel={10}
            focussedMarkerIndex={focusedLocationIndex}
          />
        </div>
      </div>
    </>
  );
};

export default Physician;
