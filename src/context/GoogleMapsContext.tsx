import React, { createContext, useContext, ReactNode } from "react";
import { useJsApiLoader, Libraries } from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "@/lib/constants";

type GoogleMapsContextType = {
  isLoaded: boolean;
  loadError: Error | undefined;
};

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(
  undefined
);

const libraries: Libraries = ["places"];

export const GoogleMapsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries,
    id: "google-map-script",
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = (): GoogleMapsContextType => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }

  return context;
};
