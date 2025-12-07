import React from 'react';
import { GeoPosition } from '../types';

interface StatsOverlayProps {
  currentPosition: GeoPosition | null;
  totalPoints: number;
  isTracking: boolean;
  onToggleTracking: () => void;
}

export const StatsOverlay: React.FC<StatsOverlayProps> = ({ 
  currentPosition, 
  totalPoints, 
  isTracking,
  onToggleTracking
}) => {
  if (!currentPosition && isTracking) {
    return (
      <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg border-l-4 border-yellow-500 animate-pulse">
        <p className="text-sm font-semibold text-gray-700">Waiting for GPS signal...</p>
      </div>
    );
  }

  if (!currentPosition) return null;

  return (
    <div className="absolute bottom-8 left-4 right-4 md:left-8 md:right-auto md:w-80 z-[1000] flex flex-col gap-3">
      {/* Stats Card */}
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Accuracy</p>
            <p className="text-lg font-mono font-bold text-gray-800">
              {Math.round(currentPosition.accuracy)} m
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Points</p>
            <p className="text-lg font-mono font-bold text-blue-600">
              {totalPoints}
            </p>
          </div>
          <div>
             <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Speed</p>
             <p className="text-lg font-mono font-bold text-gray-800">
               {currentPosition.speed ? `${(currentPosition.speed * 3.6).toFixed(1)} km/h` : '0 km/h'}
             </p>
          </div>
          <div>
             <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Heading</p>
             <p className="text-lg font-mono font-bold text-gray-800">
               {currentPosition.heading ? `${Math.round(currentPosition.heading)}°` : 'N/A'}
             </p>
          </div>
        </div>
      </div>

      {/* Control Button */}
      <button
        onClick={onToggleTracking}
        className={`w-full py-3 px-6 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
          isTracking 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
            : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30'
        }`}
      >
        {isTracking ? 'Stop Tracking' : 'Resume Tracking'}
      </button>
    </div>
  );
};
