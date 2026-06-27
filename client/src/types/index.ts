export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface MonthlyDataPoint {
  lat: number;
  lon: number;
  rainfall: number | null;
  maxTemp: number | null;
  minTemp: number | null;
}

export interface ClimateData {
  id: string;
  region: string;
  state: string;
  district: string;
  date: string;
  rainfall: number;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  windSpeed: number;
  cloudCoverage: number;
  lat: number;
  lon: number;
}

export interface Prediction {
  id: string;
  region: string;
  date: string;
  predictedRainfall: number;
  predictedMaxTemp: number;
  predictedMinTemp: number;
  confidence: number;
  modelAccuracy: number;
  factors: string[];
}

export interface Simulation {
  id: string;
  region: string;
  scenario: string;
  tempChange: number;
  rainfallChange: number;
  droughtProbability: number;
  floodRisk: number;
  timestamp: string;
}

export interface ClimateRisk {
  district: string;
  riskScore: number;
  factors: {
    rainfall: number;
    temperature: number;
    anomaly: number;
    prediction: number;
  };
}

export interface Alert {
  id: string;
  type: 'heatwave' | 'flood' | 'drought' | 'cyclone' | 'heavy_rainfall';
  severity: 'low' | 'medium' | 'high' | 'critical';
  region: string;
  message: string;
  timestamp: string;
  active: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  source: 'IMD' | 'INSAT' | 'MOSDAC' | 'Bhuvan';
  coverage: string;
  resolution: string;
  description: string;
  lastUpdated: string;
}

export type MapLayer = 
  | 'rainfall' 
  | 'maxTemp' 
  | 'minTemp' 
  | 'lst' 
  | 'sst' 
  | 'humidity' 
  | 'clouds' 
  | 'wind';

export type BaseMapId =
  | 'clear_view'
  | 'street'
  | 'natural_earth'
  | 'black_marble'
  | 'true_marble'
  | 'natural';

export type VisMode = 'raw_grid' | 'idw' | 'contour' | 'kriging';

export interface MapState {
  center: [number, number];
  zoom: number;
  activeLayer: MapLayer;
  showBoundaries: boolean;
}
