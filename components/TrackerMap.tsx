import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { GeoPosition } from '../types';
import { MapController } from './MapController';

interface TrackerMapProps {
  positions: GeoPosition[];
  currentPosition: GeoPosition | null;
}

// Custom pulsing icon using the CSS defined in index.html
const userIcon = L.divIcon({
  className: 'user-marker-pulse',
  iconSize: [20, 20],
  iconAnchor: [10, 10], // Center the icon (half of size)
});

export const TrackerMap: React.FC<TrackerMapProps> = ({ positions, currentPosition }) => {
  // Convert GeoPositions to Leaflet-friendly LatLngTuples
  const pathCoordinates = positions.map(pos => [pos.lat, pos.lng] as [number, number]);
  
  // Default center if no position yet (e.g., London)
  const defaultCenter: [number, number] = [51.505, -0.09];
  const center = currentPosition 
    ? [currentPosition.lat, currentPosition.lng] as [number, number]
    : defaultCenter;

  return (
    <MapContainer 
      center={center} 
      zoom={16} 
      scrollWheelZoom={true} 
      className="w-full h-full z-0"
      zoomControl={false} // We can add custom zoom controls if needed, hiding default for cleaner mobile look
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* The component that handles auto-panning */}
      <MapController currentPosition={currentPosition} autoPan={true} />

      {/* The path trail */}
      <Polyline 
        positions={pathCoordinates} 
        pathOptions={{ 
          color: '#3b82f6', // Tailwind blue-500
          weight: 6,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round'
        }} 
      />

      {/* Current Position Marker */}
      {currentPosition && (
        <Marker position={center} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold">You are here</p>
              <p className="text-xs text-gray-500">
                {new Date(currentPosition.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};