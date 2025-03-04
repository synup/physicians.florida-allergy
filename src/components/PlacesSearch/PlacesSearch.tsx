"use client";
import { Autocomplete } from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "@/lib/constants";
import { useState, useRef } from "react";
import parseGooglePlace from "parse-google-place";
import { getDetails, getGeocode, getLatLng } from "use-places-autocomplete";
import { haveValue } from "@/lib/helper";
import { useGoogleMaps } from "@/context/GoogleMapsContext";

const PlacesSearch = (props: { onSubmit: (place: any) => any }) => {
  // Context
  const { isLoaded, loadError } = useGoogleMaps();

  // Props
  const { onSubmit } = props;

  // States
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Refs
  const inputEl = useRef<HTMLInputElement>(null);

  // Handlers
  const onLoad = (autocompleteObj: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteObj);
  };

  const placeChangeHandler = async () => {
    const event = window.event as KeyboardEvent;
    if (event instanceof KeyboardEvent && event.key === "Enter") {
      event.preventDefault();
      return false;
    }
    if (autocomplete) {
      const place = autocomplete?.getPlace();
      const formatted_address = place.formatted_address;
      const lat = place?.geometry?.location?.lat();
      const lng = place?.geometry?.location?.lng();
      const parseAddress = parseGooglePlace(place);
      onSubmit({
        lat: lat,
        lng: lng,
        formatted_address: formatted_address,
        city: parseAddress.city,
        state: parseAddress.stateShort,
        country: parseAddress.countryShort,
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            setLoading(true);
            // Reverse geocode to get the address
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`
            );
            const data = await response.json();
            if (data.status === "OK") {
              const result = data.results[0];
              const formatted_address = result.formatted_address;
              const parsedAddress = parseGooglePlace(result);

              if (inputEl.current) {
                inputEl.current.value = formatted_address;
              }
              onSubmit({
                lat: latitude,
                lng: longitude,
                formatted_address,
                city: parsedAddress.city,
                state: parsedAddress.stateShort,
                country: parsedAddress.countryShort,
              });
            } else {
              console.error("Geocoding failed: ", data.status);
            }
          } catch (error) {
            console.error("Error fetching geocoding data: ", error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error(`Error Code: ${error.code}, Message: ${error.message}`);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const address: string = inputEl.current?.value || "";
      if (!haveValue(address)) {
        alert("Enter valid address");
        return;
      }
      const results = await getGeocode({ address });
      if (results) {
        const result = results[0];
        if (result) {
          const placeId = result.place_id;
          if (placeId) {
            const parameters = {
              placeId,
              fields: ["address_components", "geometry"],
            };

            const [details, latLng] = await Promise.all([
              getDetails(parameters),
              getLatLng(result),
            ]);

            if (details && latLng) {
              const { lat, lng } = latLng;
              const addressComponents =
                (details as google.maps.places.PlaceResult)
                  ?.address_components || [];
              let country = "";
              let state = "";
              let city = "";

              addressComponents.forEach((component) => {
                if (component.types.includes("locality")) {
                  city = component.long_name;
                }
                if (component.types.includes("administrative_area_level_1")) {
                  state = component.short_name;
                }
                if (component.types.includes("country")) {
                  country = component.short_name;
                }
              });

              onSubmit({
                lat,
                lng,
                formatted_address: address,
                city,
                state,
                country,
              });
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadError) {
    return <div>Error loading Google Maps: {loadError.message}</div>;
  }
  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <>
      <div className="flex gap-12 justify-between items-center">
        <p className="text-[#373A3C] text-[15px]">
          Enter ZIP Code or City/State
        </p>
        <button
          type="button"
          className=" px-[12px]  py-[6px] text-[15px] text-[#2780E3] hover:underline"
          onClick={getCurrentLocation}
        >
          Use my Location
        </button>
      </div>
      <form onSubmit={formSubmitHandler}>
        <div className="flex items-center gap-2 space-x-2 mt-2">
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={placeChangeHandler}
            options={{
              types: ["geocode"],
            }}
            className="w-full"
          >
            <input
              type="text"
              className="flex-1 px-[12px] py-[6px] bg-white w-full border rounded-lg"
              ref={inputEl}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              placeholder="e.g. New York, 10010"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  return false;
                }
              }}
            />
          </Autocomplete>
          <button
            // type="button"
            disabled={loading}
            // onClick={btnClickHandler}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>
      </form>
    </>
  );
};

export default PlacesSearch;
