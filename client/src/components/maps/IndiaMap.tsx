'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, useMap, Pane } from 'react-leaflet';
import { climateAPI } from '@/services/api';
import type { MonthlyDataPoint, MapLayer } from '@/types';
import 'leaflet/dist/leaflet.css';

const CENTER: [number, number] = [20.5937, 78.9629];
const ZOOM = 5;

const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [4.0, 65.0],
  [39.0, 100.0],
];

function MapController() {
  const map = useMap();
  useEffect(() => { map.setView(CENTER, ZOOM); }, []);
  return null;
}

function rainfallColor(value: number): string {
  if (value <= 0)   return '#f0f9ff';
  if (value < 5)    return '#e0f2fe';
  if (value < 15)   return '#bae6fd';
  if (value < 30)   return '#7dd3fc';
  if (value < 60)   return '#38bdf8';
  if (value < 100)  return '#0ea5e9';
  if (value < 150)  return '#0284c7';
  if (value < 250)  return '#0369a1';
  if (value < 400)  return '#075985';
  if (value < 600)  return '#0c4a6e';
  return '#082f49';
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

const LEGENDS: Record<string, { label: string; color: string }[]> = {
  rainfall: [
    { label: '0', color: '#f0f9ff' },
    { label: '5', color: '#e0f2fe' },
    { label: '15', color: '#bae6fd' },
    { label: '30', color: '#7dd3fc' },
    { label: '60', color: '#38bdf8' },
    { label: '100', color: '#0ea5e9' },
    { label: '150', color: '#0284c7' },
    { label: '250', color: '#0369a1' },
    { label: '400', color: '#075985' },
    { label: '600', color: '#0c4a6e' },
    { label: '>600', color: '#082f49' },
  ],
  minTemp: [
    { label: '<5°C', color: '#0c4a6e' },
    { label: '5-10', color: '#0369a1' },
    { label: '10-15', color: '#0284c7' },
    { label: '15-20', color: '#0ea5e9' },
    { label: '20-25', color: '#38bdf8' },
    { label: '25-30', color: '#7dd3fc' },
    { label: '>30°C', color: '#bae6fd' },
  ],
  maxTemp: [
    { label: '<20°C', color: '#bbf7d0' },
    { label: '20-25', color: '#86efac' },
    { label: '25-30', color: '#4ade80' },
    { label: '30-35', color: '#fcd34d' },
    { label: '35-38', color: '#fb923c' },
    { label: '38-40', color: '#f97316' },
    { label: '>40°C', color: '#dc2626' },
  ],
};

function RasterLayer({ data, layer, onLocationSelect }: { data: MonthlyDataPoint[]; layer: MapLayer; onLocationSelect: (loc: any) => void }) {
  const map = useMap();
  const overlayRef = useRef<L.ImageOverlay | null>(null);
  const boundaryRef = useRef<number[][][][] | null>(null);

  useEffect(() => {
    fetch('/data/india.json')
      .then(r => r.json())
      .then(gj => {
        const feature = gj.features?.[0];
        if (feature?.geometry?.type === 'MultiPolygon') {
          boundaryRef.current = feature.geometry.coordinates;
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (data.length < 2) return;
    const lats = Array.from(new Set(data.map(d => d.lat))).sort((a, b) => a - b);
    const lons = Array.from(new Set(data.map(d => d.lon))).sort((a, b) => a - b);
    const rows = lats.length;
    const cols = lons.length;
    const minLat = lats[0], maxLat = lats[rows - 1];
    const minLon = lons[0], maxLon = lons[cols - 1];
    const lonMap = new Map(lons.map((v, i) => [v, i]));
    const latMap = new Map(lats.map((v, i) => [v, rows - 1 - i]));
    const isRain = layer === 'rainfall';

    const up = 8;
    const w = cols * up, h = rows * up;
    const cvs = document.createElement('canvas');
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext('2d')!;

    const mer = (lat: number) => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
    const merY = lats.map(mer);
    const minMY = merY[0], maxMY = merY[rows - 1];
    const myRng = maxMY - minMY;
    const latToY = (lat: number) => h - ((mer(lat) - minMY) / myRng * h);

    const rings = boundaryRef.current;
    if (rings) {
      ctx.save();
      ctx.beginPath();
      for (const polygon of rings) {
        for (const ring of polygon) {
          if (ring.length < 3) continue;
          const sx = ((ring[0][0] as number) - minLon) / (maxLon - minLon) * w;
          const sy = latToY(ring[0][1] as number);
          ctx.moveTo(sx, sy);
          for (let i = 1; i < ring.length; i++) {
            const px = ((ring[i][0] as number) - minLon) / (maxLon - minLon) * w;
            const py = latToY(ring[i][1] as number);
            ctx.lineTo(px, py);
          }
          ctx.closePath();
        }
      }
      ctx.clip('evenodd');
    }

    for (const d of data) {
      const col = lonMap.get(d.lon);
      const row = latMap.get(d.lat);
      if (col === undefined || row === undefined) continue;
      const value = isRain ? d.rainfall : layer === 'maxTemp' ? d.maxTemp : d.minTemp;
      if (value === null || value < 0) continue;
      ctx.fillStyle = isRain ? rainfallColor(value) : tempColor(value, layer);
      const y0 = latToY(d.lat);
      const nextLatIdx = rows - 2 - row;
      const nextLat = nextLatIdx >= 0 ? lats[nextLatIdx] : lats[0] - (lats[1] - lats[0]);
      const y1 = latToY(nextLat);
      ctx.fillRect(col * up + 1, y0 + 1, up - 2, (y1 - y0) - 2);
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    for (let i = 1; i < cols; i++) {
      const x = i * up;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
      ctx.stroke();
    }
    for (let j = 0; j < rows; j++) {
      const y = latToY(lats[j]);
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }

    if (rings) ctx.restore();

    const imageUrl = cvs.toDataURL('image/png');
    const bounds = L.latLngBounds([[minLat, minLon], [maxLat, maxLon]]);

    if (overlayRef.current) {
      overlayRef.current.setBounds(bounds);
      overlayRef.current.setUrl(imageUrl);
    } else {
      if (!map.getPane('data')) map.createPane('data');
      const pane = map.getPane('data')!;
      pane.style.zIndex = '400';
      pane.style.pointerEvents = 'none';
      overlayRef.current = L.imageOverlay(imageUrl, bounds, { pane: 'data' });
      overlayRef.current.addTo(map);
    }

    return () => {
      if (overlayRef.current) {
        overlayRef.current.remove();
        overlayRef.current = null;
      }
    };
  }, [map, data, layer]);

  useEffect(() => {
    function findNearest(latlng: { lat: number; lng: number }) {
      let closest: MonthlyDataPoint | null = null;
      let minDist = Infinity;
      for (const d of data) {
        const dist = (d.lat - latlng.lat) ** 2 + (d.lon - latlng.lng) ** 2;
        if (dist < minDist) { minDist = dist; closest = d; }
      }
      return closest;
    }
    function handleHover(e: any) {
      const closest = findNearest(e.latlng);
      if (closest) {
        map.getContainer().style.cursor = 'crosshair';
      }
    }
    function handleClick(e: any) {
      const closest = findNearest(e.latlng);
      if (closest) {
        onLocationSelect({
          name: `${closest.lat.toFixed(4)}°N, ${closest.lon.toFixed(4)}°E`,
          rainfall: closest.rainfall ?? 0,
          maxTemp: closest.maxTemp ?? 0,
          minTemp: closest.minTemp ?? 0,
        });
      }
    }
    map.on('mousemove', handleHover);
    map.on('click', handleClick);
    return () => {
      map.off('mousemove', handleHover);
      map.off('click', handleClick);
      map.getContainer().style.cursor = '';
    };
  }, [map, data, onLocationSelect]);

  return null;
}

export default function IndiaMap({ year, month, activeLayer, onLocationSelect }: { year: number; month: number; activeLayer: MapLayer; onLocationSelect: (loc: any) => void }) {
  const [data, setData] = useState<MonthlyDataPoint[]>([]);

  useEffect(() => {
    async function fetchMonthly() {
      try {
        const variable = activeLayer === 'rainfall' ? 'rainfall' : activeLayer === 'maxTemp' ? 'max_temp' : activeLayer === 'minTemp' ? 'min_temp' : undefined;
        const response = await climateAPI.getMonthlyData(year, month, variable);
        setData(response.data.filter((d: MonthlyDataPoint) => d.lat && d.lon));
      } catch (err) {
        console.warn('Could not fetch monthly climate data:', err);
        setData([]);
      }
    }
    fetchMonthly();
  }, [year, month, activeLayer]);

  const legend = LEGENDS[activeLayer] || LEGENDS.rainfall;
  const legendTitle = activeLayer === 'rainfall' ? 'Rainfall (mm)' : activeLayer === 'minTemp' ? 'Min Temp (°C)' : 'Max Temp (°C)';

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={CENTER}
        zoom={ZOOM}
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={1.0}
        minZoom={4}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapController />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        />
        {data.length > 0 && (
          <RasterLayer data={data} layer={activeLayer} onLocationSelect={onLocationSelect} />
        )}
        <Pane name="labels" style={{ zIndex: 500, pointerEvents: 'none' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          />
        </Pane>
      </MapContainer>
      <div className="absolute bottom-6 left-4 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-3.5 text-xs border border-white/20 min-w-[90px]">
        <p className="font-semibold mb-2 dark:text-white capitalize">{legendTitle}</p>
        {legend.map(item => (
          <div key={item.label} className="flex items-center gap-2.5 py-1">
            <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="dark:text-gray-300 text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
