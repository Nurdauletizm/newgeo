import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoPosition } from '../types';

interface MapControllerProps {
  currentPosition: GeoPosition | null;
  autoPan: boolean;
}

export const MapController: React.FC<MapControllerProps> = ({ currentPosition, autoPan }) => {
  const map = useMap();

  useEffect(() => {
    if (currentPosition && autoPan) {
      // Smooth flyTo animation to the new position
      map.flyTo([currentPosition.lat, currentPosition.lng], map.getZoom(), {
        animate: true,
        duration: 1 // 1 second animation duration
      });
    }
  }, [currentPosition, autoPan, map]);

  return null;
};
