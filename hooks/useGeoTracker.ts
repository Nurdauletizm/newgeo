import { useState, useEffect, useRef, useCallback } from 'react';
import { GeoPosition, TrackerState } from '../types';

export const useGeoTracker = () => {
  const [state, setState] = useState<TrackerState>({
    isTracking: false,
    positions: [],
    currentPosition: null,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: "Geolocation is not supported by your browser." }));
      return;
    }

    // Reset error state
    setState(prev => ({ ...prev, isTracking: true, error: null }));

    const options: PositionOptions = {
      enableHighAccuracy: true, // Crucial for walking/running
      timeout: 10000,
      maximumAge: 0,
    };

    const handleSuccess = (pos: GeolocationPosition) => {
      const newPos: GeoPosition = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        heading: pos.coords.heading,
        speed: pos.coords.speed,
        timestamp: pos.timestamp,
      };

      setState(prev => {
        // Simple filter: Don't add if it's identical to the very last one to save memory
        // In a real app, you might filter by distance moved (e.g., > 2 meters)
        const lastPos = prev.positions[prev.positions.length - 1];
        const isDuplicate = lastPos && lastPos.lat === newPos.lat && lastPos.lng === newPos.lng;
        
        const newPositions = isDuplicate ? prev.positions : [...prev.positions, newPos];

        // ---------------------------------------------------------------------------
        // WEBSOCKET INTEGRATION TIP:
        // This is where you would emit the new position to a backend server.
        // Example: socket.emit('update-location', { userId: '123', ...newPos });
        // ---------------------------------------------------------------------------

        return {
          ...prev,
          positions: newPositions,
          currentPosition: newPos,
        };
      });
    };

    const handleError = (err: GeolocationPositionError) => {
      let errorMessage = "An unknown error occurred.";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Location permission denied. Please enable it in settings.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Location information is unavailable.";
          break;
        case err.TIMEOUT:
          errorMessage = "The request to get user location timed out.";
          break;
      }
      setState(prev => ({ ...prev, error: errorMessage, isTracking: false }));
    };

    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState(prev => ({ ...prev, isTracking: false }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startTracking,
    stopTracking
  };
};
