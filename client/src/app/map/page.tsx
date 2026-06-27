'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/common/Navbar';
import { useAppStore } from '@/store';
import type { MapLayer } from '@/types';

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

export default function MapPage() {
  const { mapState, selectedMonth, setMapLayer, setMonth } = useAppStore();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <Navbar transparent />

      <div className="absolute inset-0 top-0">
        <IndiaMap year={2025} month={selectedMonth} onLocationSelect={setSelectedLocation} />
      </div>

      {/* Layer buttons - top center */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] flex gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-lg p-1">
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setMapLayer(layer.id)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
              mapState.activeLayer === layer.id
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Month selector - top right */}
      <div className="absolute top-20 right-6 z-[1000]">
        <button
          onClick={() => setShowMonthPicker(!showMonthPicker)}
          className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full shadow-lg px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all"
        >
          <Calendar className="h-4 w-4" />
          {MONTHS[selectedMonth - 1]} 2025
        </button>

        <AnimatePresence>
          {showMonthPicker && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden w-40"
            >
              {MONTHS.map((name, i) => (
                <button
                  key={i}
                  onClick={() => { setMonth(i + 1); setShowMonthPicker(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-all ${
                    selectedMonth === i + 1
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location info popup */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-6 right-6 z-[1000] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl p-4 min-w-[200px] border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm dark:text-white">Location Info</span>
              <button onClick={() => setSelectedLocation(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Rainfall</span>
                <span className="font-medium dark:text-white">{selectedLocation.rainfall.toFixed(1)} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Max Temp</span>
                <span className="font-medium dark:text-white">{selectedLocation.maxTemp.toFixed(1)} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Min Temp</span>
                <span className="font-medium dark:text-white">{selectedLocation.minTemp.toFixed(1)} °C</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
