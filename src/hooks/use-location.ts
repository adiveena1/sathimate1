import { useState, useCallback, useRef } from 'react';

export interface LocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
  });
  const watchIdRef = useRef<number | null>(null);

  const getLocation = useCallback(() => {
    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setLocation({ lat: null, lng: null, error: 'Geolocation is not supported by your browser.', loading: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Failed to get location.';
        switch(error.code) {
          case error.PERMISSION_DENIED:
             errorMessage = 'Location permission was denied. Please allow location access to use Nearby features.';
             break;
          case error.POSITION_UNAVAILABLE:
             errorMessage = 'Location information is unavailable.';
             break;
          case error.TIMEOUT:
             errorMessage = 'The request to get user location timed out.';
             break;
        }
        setLocation({ lat: null, lng: null, error: errorMessage, loading: false });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const clearLocation = useCallback(() => {
    // Clear any active watch
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLocation({
      lat: null,
      lng: null,
      error: null,
      loading: false,
    });
  }, []);

  return { ...location, getLocation, setLocation, clearLocation };
}
