'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useAppStore } from '@/store';
import 'leaflet/dist/leaflet.css';

const indiaStates = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Maharashtra', state: 'Maharashtra', district: 'Mumbai', rainfall: 1850, temp: 32 },
      geometry: { type: 'Point', coordinates: [72.8777, 19.0760] }
    },
    {
      type: 'Feature',
      properties: { name: 'Karnataka', state: 'Karnataka', district: 'Bangalore', rainfall: 980, temp: 28 },
      geometry: { type: 'Point', coordinates: [77.5946, 12.9716] }
    },
    {
      type: 'Feature',
      properties: { name: 'Tamil Nadu', state: 'Tamil Nadu', district: 'Chennai', rainfall: 1420, temp: 35 },
      geometry: { type: 'Point', coordinates: [80.2707, 13.0827] }
    },
    {
      type: 'Feature',
      properties: { name: 'Kerala', state: 'Kerala', district: 'Thiruvananthapuram', rainfall: 2120, temp: 31 },
      geometry: { type: 'Point', coordinates: [76.9366, 8.5241] }
    },
    {
      type: 'Feature',
      properties: { name: 'Rajasthan', state: 'Rajasthan', district: 'Jaipur', rainfall: 450, temp: 42 },
      geometry: { type: 'Point', coordinates: [75.7873, 26.9124] }
    },
    {
      type: 'Feature',
      properties: { name: 'Delhi', state: 'Delhi', district: 'New Delhi', rainfall: 680, temp: 38 },
      geometry: { type: 'Point', coordinates: [77.2090, 28.6139] }
    },
    {
      type: 'Feature',
      properties: { name: 'West Bengal', state: 'West Bengal', district: 'Kolkata', rainfall: 1680, temp: 36 },
      geometry: { type: 'Point', coordinates: [88.3639, 22.5726] }
    },
    {
      type: 'Feature',
      properties: { name: 'Gujarat', state: 'Gujarat', district: 'Ahmedabad', rainfall: 720, temp: 41 },
      geometry: { type: 'Point', coordinates: [72.5714, 23.0225] }
    }
  ]
};

function MapController() {
  const map = useMap();
  const { mapState } = useAppStore();

  useEffect(() => {
    map.setView(mapState.center, mapState.zoom);
  }, [map, mapState.center, mapState.zoom]);

  return null;
}

export default function IndiaMap({ onLocationSelect }: { onLocationSelect: (location: any) => void }) {
  const { mapState } = useAppStore();

  const getColor = (value: number) => {
    if (mapState.activeLayer === 'rainfall') {
      return value > 2000 ? '#166534' :
             value > 1500 ? '#15803d' :
             value > 1000 ? '#16a34a' :
             value > 500  ? '#22c55e' : '#86efac';
    } else {
      return value > 40 ? '#166534' :
             value > 35 ? '#15803d' :
             value > 30 ? '#16a34a' :
             value > 25 ? '#22c55e' : '#86efac';
    }
  };

  const pointToLayer = (feature: any, latlng: any) => {
    const value = mapState.activeLayer === 'rainfall' ? feature.properties.rainfall : feature.properties.temp;
    
    return (window as any).L.circleMarker(latlng, {
      radius: 8,
      fillColor: getColor(value),
      color: '#15803d',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7
    });
  };

  const onEachFeature = (feature: any, layer: any) => {
    const { state, district, rainfall, temp } = feature.properties;
    
    layer.bindPopup(`
      <div style="font-family: sans-serif;">
        <strong style="font-size: 14px;">${state}</strong><br/>
        <span style="color: #15803d;">${district}</span><br/>
        <div style="margin-top: 8px;">
          <strong>Rainfall:</strong> ${rainfall} mm<br/>
          <strong>Temperature:</strong> ${temp}°C
        </div>
      </div>
    `);
    
    layer.on('click', () => {
      onLocationSelect({ state, district, rainfall, temp });
    });
  };

  return (
    <MapContainer
      center={mapState.center}
      zoom={mapState.zoom}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      className="z-0"
    >
      <MapController />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <GeoJSON
        data={indiaStates as any}
        pointToLayer={pointToLayer}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}
