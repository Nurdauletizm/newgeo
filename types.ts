export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  heading: number | null;
  speed: number | null;
}

export interface TrackerState {
  isTracking: boolean;
  positions: GeoPosition[];
  currentPosition: GeoPosition | null;
  error: string | null;
}

export enum PermissionStatus {
  UNKNOWN = 'UNKNOWN',
  GRANTED = 'GRANTED',
  DENIED = 'DENIED',
  PROMPT = 'PROMPT',
}
