'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/store';
import type { MapLayer, BaseMapId, VisMode } from '@/types';

const IndiaMap = dynamic(() => import('@/components/maps/IndiaMap'), { ssr: false });

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const LAYERS: { id: MapLayer; label: string }[] = [
  { id: 'rainfall', label: 'Rainfall' },
  { id: 'maxTemp', label: 'Max Temp' },
  { id: 'minTemp', label: 'Min Temp' },
];

const BASE_MAP_OPTIONS: { id: BaseMapId; label: string }[] = [
  { id: 'clear_view', label: 'Clear View' },
  { id: 'street', label: 'Street' },
  { id: 'natural_earth', label: 'Natural Earth' },
  { id: 'black_marble', label: 'Black Marble' },
  { id: 'true_marble', label: 'True Marble' },
  { id: 'natural', label: 'Natural' },
];

const VIS_MODES: { id: VisMode; label: string; desc: string }[] = [
  { id: 'raw_grid', label: 'Raw IMD Grid', desc: 'Original measurements' },
  { id: 'idw', label: 'IDW', desc: 'Inverse distance weighted' },
  { id: 'contour', label: 'Contour', desc: 'Filled contour map' },
  { id: 'kriging', label: 'Kriging', desc: 'Geostatistical interpolation' },
];

export default function MapPage() {
  const { mapState, selectedMonth, setMapLayer, setMonth } = useAppStore();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [baseMap, setBaseMap] = useState<BaseMapId>('clear_view');
  const [visMode, setVisMode] = useState<VisMode>('raw_grid');

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black">
      <div className="absolute inset-0">
        <IndiaMap year={2025} month={selectedMonth} activeLayer={mapState.activeLayer} baseMap={baseMap} visMode={visMode} onLocationSelect={setSelectedLocation} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-[999]" />

      {/* Layer pills */}
      <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex gap-1 bg-white/15 backdrop-blur-xl rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.25)] p-1 border border-white/10">
          {LAYERS.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setMapLayer(layer.id)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                mapState.activeLayer === layer.id
                  ? 'bg-white text-gray-900 shadow-lg scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Month selector */}
      <div className="absolute top-[72px] right-6 z-[1000]">
        <button
          onClick={() => setShowMonthPicker(!showMonthPicker)}
          className="flex items-center gap-2 bg-white/15 backdrop-blur-xl rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.25)] px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/20 transition-all border border-white/10"
        >
          <Calendar className="h-4 w-4" />
          {MONTHS[selectedMonth - 1]} 2025
        </button>

        <AnimatePresence>
          {showMonthPicker && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 8, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 mt-1 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden w-44"
            >
              <div className="py-1">
                {MONTHS.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => { setMonth(i + 1); setShowMonthPicker(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                      selectedMonth === i + 1
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location info popup */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-24 right-6 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 min-w-[200px] border border-white/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm dark:text-white">{selectedLocation.name}</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Rainfall</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{selectedLocation.rainfall.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Max Temp</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">{selectedLocation.maxTemp.toFixed(1)} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Min Temp</span>
                <span className="font-medium text-cyan-600 dark:text-cyan-400">{selectedLocation.minTemp.toFixed(1)} °C</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visualisation mode selector */}
      <div className="absolute bottom-72 left-4 z-[1000] flex flex-col gap-0.5 bg-white/15 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.25)] p-2 border border-white/10 min-w-[120px]">
        <span className="text-[10px] uppercase tracking-wider text-white/60 px-2 pb-1 font-semibold">Render</span>
        {VIS_MODES.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setVisMode(opt.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 text-left ${
              visMode === opt.id
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            title={opt.desc}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Base map selector */}
      <div className="absolute bottom-48 left-4 z-[1000] flex flex-col gap-0.5 bg-white/15 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.25)] p-2 border border-white/10">
        <span className="text-[10px] uppercase tracking-wider text-white/60 px-2 pb-1 font-semibold">Base</span>
        {BASE_MAP_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setBaseMap(opt.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 text-left ${
              baseMap === opt.id
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
