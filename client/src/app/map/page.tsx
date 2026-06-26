'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, MapPin, Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/common/Navbar';
import { useAppStore } from '@/store';
import type { MapLayer } from '@/types';

const IndiaMap = dynamic(() => import('@/components/maps/IndiaMap'), { ssr: false });

export default function MapPage() {
  const { mapState, setMapLayer } = useAppStore();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const layers: { id: MapLayer; label: string; color: string }[] = [
    { id: 'rainfall', label: 'Rainfall', color: 'bg-green-600' },
    { id: 'maxTemp', label: 'Max Temperature', color: 'bg-green-500' },
    { id: 'minTemp', label: 'Min Temperature', color: 'bg-green-400' },
    { id: 'humidity', label: 'Humidity', color: 'bg-green-300' },
    { id: 'clouds', label: 'Cloud Coverage', color: 'bg-green-700' },
    { id: 'wind', label: 'Wind Speed', color: 'bg-green-800' },
  ];

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-950">
      <Navbar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold text-green-900 dark:text-green-50 mb-2">Interactive Climate Map</h1>
            <p className="text-green-700 dark:text-green-400">Explore India's climate data by state and district</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Layer Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layers className="h-5 w-5" />
                    Climate Layers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {layers.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setMapLayer(layer.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        mapState.activeLayer === layer.id
                          ? 'border-green-500 bg-green-600/5'
                          : 'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${layer.color}`} />
                        <span className="font-semibold dark:text-green-50">{layer.label}</span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {selectedLocation && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Info className="h-5 w-5" />
                      Location Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-400">State</p>
                      <p className="font-semibold dark:text-green-50">{selectedLocation.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-400">District</p>
                      <p className="font-semibold dark:text-green-50">{selectedLocation.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-400">Rainfall</p>
                      <p className="font-semibold dark:text-green-50">{selectedLocation.rainfall} mm</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-400">Temperature</p>
                      <p className="font-semibold dark:text-green-50">{selectedLocation.temp}°C</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <Card className="h-[700px]">
                <CardContent className="p-0 h-full">
                  <IndiaMap onLocationSelect={setSelectedLocation} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
