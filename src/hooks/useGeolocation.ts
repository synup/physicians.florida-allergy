// hooks/useGeolocation.ts
'use client';
import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError(`Unable to retrieve your location: ${error.message}`);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    startGeolocation();
  }, []);

  return { location, error, loading, startGeolocation };
};
