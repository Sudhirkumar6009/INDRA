'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useAppStore } from '@/store';
import { climateAPI } from '@/services/api';
import type { MonthlyDataPoint, MapLayer } from '@/types';
import 'leaflet/dist/leaflet.css';

function MapController() {
  const map = useMap();
  const { mapState } = useAppStore();

  useEffect(() => {
    map.setView(mapState.center, mapState.zoom);
  }, [map, mapState.center, mapState.zoom]);

  return null;
}

function estimateCellHalo(data: MonthlyDataPoint[]): number {
  const lats = Array.from(new Set(data.map(d => d.lat))).sort((a, b) => a - b);
  if (lats.length < 2) return 0.125;
  let minDiff = Infinity;
  for (let i = 1; i < Math.min(lats.length, 50); i++) {
    const diff = lats[i] - lats[i - 1];
    if (diff > 0 && diff < minDiff) minDiff = diff;
  }
  return minDiff === Infinity ? 0.125 : minDiff / 2;
}

function makeCell(lat: number, lon: number, half: number) {
  return [[
    [lon - half, lat - half],
    [lon + half, lat - half],
    [lon + half, lat + half],
    [lon - half, lat + half],
    [lon - half, lat - half],
  ]];
}

function rainfallColor(value: number): string {
  if (value <= 0) return '#f0f9ff';
  if (value < 10)   return '#bae6fd';
  if (value < 50)   return '#7dd3fc';
  if (value < 100)  return '#38bdf8';
  if (value < 200)  return '#0ea5e9';
  if (value < 400)  return '#0284c7';
  if (value < 700)  return '#0369a1';
  return '#0c4a6e';
}

function tempColor(value: number, layer: MapLayer): string {
  if (layer === 'minTemp') {
    if (value <= 5)  return '#0c4a6e';
    if (value <= 10) return '#0369a1';
    if (value <= 15) return '#0284c7';
    if (value <= 20) return '#0ea5e9';
    if (value <= 25) return '#38bdf8';
    if (value <= 30) return '#7dd3fc';
    return '#bae6fd';
  }
  if (value <= 20) return '#bbf7d0';
  if (value <= 25) return '#86efac';
  if (value <= 30) return '#4ade80';
  if (value <= 35) return '#fcd34d';
  if (value <= 38) return '#fb923c';
  if (value <= 40) return '#f97316';
  return '#dc2626';
}

function getLegend(layer: MapLayer): { label: string; color: string }[] {
  if (layer === 'rainfall') {
    return [
      { label: '0 mm', color: '#f0f9ff' },
      { label: '1-10', color: '#bae6fd' },
      { label: '10-50', color: '#7dd3fc' },
      { label: '50-100', color: '#38bdf8' },
      { label: '100-200', color: '#0ea5e9' },
      { label: '200-400', color: '#0284c7' },
      { label: '400-700', color: '#0369a1' },
      { label: '>700', color: '#0c4a6e' },
    ];
  }
  if (layer === 'minTemp') {
    return [
      { label: '<5°C', color: '#0c4a6e' },
      { label: '5-10', color: '#0369a1' },
      { label: '10-15', color: '#0284c7' },
      { label: '15-20', color: '#0ea5e9' },
      { label: '20-25', color: '#38bdf8' },
      { label: '25-30', color: '#7dd3fc' },
      { label: '>30°C', color: '#bae6fd' },
    ];
  }
  return [
    { label: '<20°C', color: '#bbf7d0' },
    { label: '20-25', color: '#86efac' },
    { label: '25-30', color: '#4ade80' },
    { label: '30-35', color: '#fcd34d' },
    { label: '35-38', color: '#fb923c' },
    { label: '38-40', color: '#f97316' },
    { label: '>40°C', color: '#dc2626' },
  ];
}

export default function IndiaMap({ year, month, onLocationSelect }: { year: number; month: number; onLocationSelect: (location: any) => void }) {
  const { mapState, setMapCenter } = useAppStore();
  const [data, setData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonthly() {
      setLoading(true);
      try {
        const layerKey = mapState.activeLayer;
        const variable = layerKey === 'rainfall' ? 'rainfall' : layerKey === 'maxTemp' ? 'max_temp' : layerKey === 'minTemp' ? 'min_temp' : undefined;
        const response = await climateAPI.getMonthlyData(year, month, variable);
        setData(response.data.filter((d: MonthlyDataPoint) => d.lat && d.lon));
      } catch (err) {
        console.warn('Could not fetch monthly climate data:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMonthly();
  }, [year, month, mapState.activeLayer]);

  const halfCell = useMemo(() => estimateCellHalo(data), [data]);

  const isRainfall = mapState.activeLayer === 'rainfall';

  const features = useMemo(() => {
    if (data.length === 0) return [];
    return data.map(d => ({
      type: 'Feature' as const,
      properties: {
        name: `${d.lat.toFixed(2)}, ${d.lon.toFixed(2)}`,
        rainfall: d.rainfall ?? 0,
        maxTemp: d.maxTemp ?? 0,
        minTemp: d.minTemp ?? 0,
        temp: d.maxTemp ?? 0,
        lat: d.lat,
        lon: d.lon,
      },
      geometry: {
        type: isRainfall ? ('Polygon' as const) : ('Point' as const),
        coordinates: isRainfall ? makeCell(d.lat, d.lon, halfCell) as any : [d.lon, d.lat],
      },
    }));
  }, [data, halfCell, isRainfall]);

  const geoJsonStyle = useMemo(() => {
    if (!isRainfall) return undefined;
    return (feature: any) => {
      const value = feature.properties.rainfall as number;
      return {
        fillColor: rainfallColor(value),
        weight: 0.2,
        opacity: 0.6,
        color: '#1a1a2e',
        fillOpacity: 0.85,
      };
    };
  }, [isRainfall]);

  const layerStyle = useMemo(() => {
    if (isRainfall) return undefined;
    return (feature: any) => {
      const p = feature.properties;
      const layerKey = mapState.activeLayer;
      const value = layerKey === 'maxTemp' ? p.maxTemp : layerKey === 'minTemp' ? p.minTemp : p.temp;
      return {
        fillColor: tempColor(value, layerKey),
        weight: 1,
        opacity: 0.8,
        color: '#1a1a2e',
        fillOpacity: 0.6,
      };
    };
  }, [isRainfall, mapState.activeLayer]);

  const onEachFeature = (feature: any, layer: any) => {
    const p = feature.properties;
    const isPoint = feature.geometry.type === 'Point';
    const coords = isPoint ? feature.geometry.coordinates : [p.lon, p.lat];

    layer.bindPopup(`
      <div style="font-family: sans-serif; min-width: 160px;">
        <span style="color: #15803d;">${p.name}</span>
        <hr style="margin: 6px 0; border-color: #e5e7eb;" />
        <div><strong>Rainfall:</strong> ${p.rainfall.toFixed(1)} mm</div>
        <div><strong>Max Temp:</strong> ${p.maxTemp.toFixed(1)} °C</div>
        <div><strong>Min Temp:</strong> ${p.minTemp.toFixed(1)} °C</div>
      </div>
    `);

    layer.on('click', () => {
      onLocationSelect({
        name: p.name,
        rainfall: p.rainfall,
        temp: p.temp,
        maxTemp: p.maxTemp,
        minTemp: p.minTemp,
      });
      setMapCenter([coords[1], coords[0]], 8);
    });
  };

  const legend = getLegend(mapState.activeLayer);

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-300">
          Loading data...
        </div>
      )}
      <MapContainer
        center={mapState.center}
        zoom={mapState.zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapController />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {features.length > 0 && (
          <GeoJSON
            key={`${month}-${mapState.activeLayer}-${features.length}`}
            data={{ type: 'FeatureCollection', features } as any}
            style={geoJsonStyle ?? layerStyle}
            pointToLayer={!isRainfall ? (feature: any, latlng: any) => {
              const p = feature.properties;
              const layerKey = mapState.activeLayer;
              const value = layerKey === 'maxTemp' ? p.maxTemp : layerKey === 'minTemp' ? p.minTemp : p.temp;
              return (window as any).L.circleMarker(latlng, {
                radius: 4,
                fillColor: tempColor(value, layerKey),
                color: '#1a1a2e',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.6,
              });
            } : undefined}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
      {/* Legend */}
      <div className="absolute bottom-6 left-4 z-[1000] bg-white/95 dark:bg-gray-800/95 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold mb-1.5 dark:text-white capitalize">{mapState.activeLayer === 'rainfall' ? 'Rainfall (mm)' : mapState.activeLayer === 'minTemp' ? 'Min Temp (°C)' : 'Max Temp (°C)'}</p>
        {legend.map(item => (
          <div key={item.label} className="flex items-center gap-2 py-0.5">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: item.color }} />
            <span className="dark:text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
