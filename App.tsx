import React, { useEffect, useState } from 'react';
import { useGeoTracker } from './hooks/useGeoTracker';
import { TrackerMap } from './components/TrackerMap';
import { StatsOverlay } from './components/StatsOverlay';
import { PermissionStatus } from './types';

export default function App() {
  const { 
    positions, 
    currentPosition, 
    isTracking, 
    error, 
    startTracking, 
    stopTracking 
  } = useGeoTracker();

  const [hasStarted, setHasStarted] = useState(false);

  // Attempt to start tracking automatically on mount or show a start screen
  useEffect(() => {
    // We don't auto-start immediately to respect user agency, 
    // but we could if the requirements were strict about "on load".
    // Better UX is to let them click "Start".
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    startTracking();
  };

  const handleToggle = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  // Initial Welcome/Permission Screen
  if (!hasStarted) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GeoTrail Tracker</h1>
          <p className="text-gray-600 mb-8">
            Track your walking path in real-time. This app uses your device's GPS to draw a trail on the map as you move.
          </p>
          
          <button 
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Start Tracking</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          
          <p className="mt-4 text-xs text-gray-400">
            Requires location permissions. Optimized for mobile use.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-100">
      
      {/* Map Layer */}
      <div className="absolute inset-0 z-0">
        <TrackerMap 
          positions={positions} 
          currentPosition={currentPosition} 
        />
      </div>

      {/* Header / Brand Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 pointer-events-none">
        <div className="flex justify-between items-start">
           <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm pointer-events-auto">
             <h2 className="font-bold text-slate-800 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
               GeoTrail
             </h2>
           </div>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="absolute top-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg flex justify-between items-start">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="ml-auto text-red-500 text-sm font-bold hover:text-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats & Controls Overlay */}
      <StatsOverlay 
        currentPosition={currentPosition} 
        totalPoints={positions.length} 
        isTracking={isTracking}
        onToggleTracking={handleToggle}
      />
    </div>
  );
}
