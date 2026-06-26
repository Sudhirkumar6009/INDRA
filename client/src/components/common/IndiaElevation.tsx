'use client';

import { motion } from 'framer-motion';
import { Mountain, Cloud, Thermometer, Wind, Droplets, Sun } from 'lucide-react';

const elevationData = [
  { label: 'Himalayas', value: 8848, unit: 'm', icon: Mountain, desc: 'Highest peak: Mt. Everest' },
  { label: 'Avg Monsoon', value: 1183, unit: 'mm', icon: Cloud, desc: 'Annual rainfall average' },
  { label: 'Temp Range', value: '4-48', unit: '°C', icon: Thermometer, desc: 'Seasonal variance' },
  { label: 'Wind Energy', value: 120, unit: 'GW', icon: Wind, desc: 'Potential capacity' },
  { label: 'Water Resources', value: 1953, unit: 'BCM', icon: Droplets, desc: 'Annual water potential' },
  { label: 'Solar Index', value: 5.5, unit: 'kWh/m²', icon: Sun, desc: 'Daily solar radiation' },
];

const climateZones = [
  {
    name: 'Himalayan Alpine',
    elevation: '>4,500m',
    temp: '-10°C to 10°C',
    gradient: 'from-blue-900 via-blue-800 to-blue-600',
    image: '🏔️',
    desc: 'Snow-capped peaks, glaciers, alpine meadows'
  },
  {
    name: 'Subtropical Himalayan',
    elevation: '1,000-4,500m',
    temp: '10°C to 20°C',
    gradient: 'from-green-800 via-green-600 to-green-400',
    image: '🌲',
    desc: 'Pine forests, temperate woodlands, rich biodiversity'
  },
  {
    name: 'Tropical Wet',
    elevation: '0-1,000m',
    temp: '20°C to 35°C',
    gradient: 'from-emerald-700 via-emerald-500 to-emerald-300',
    image: '🌴',
    desc: 'Rainforests, mangroves, monsoon wetlands'
  },
  {
    name: 'Arid / Desert',
    elevation: '0-500m',
    temp: '30°C to 50°C',
    gradient: 'from-amber-800 via-amber-600 to-amber-400',
    image: '🏜️',
    desc: 'Thar desert, dry scrublands, extreme heat'
  },
  {
    name: 'Coastal Plains',
    elevation: '0-100m',
    temp: '25°C to 38°C',
    gradient: 'from-sky-700 via-sky-500 to-sky-300',
    image: '🌊',
    desc: 'Beaches, estuaries, fertile deltas'
  },
];

export function IndiaElevation() {
  return (
    <section className="relative py-24 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Geographic Diversity</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-4">
            India&apos;s Atmospheric Elevation
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From the Himalayan peaks to coastal plains — India&apos;s geography creates one of the most diverse atmospheric systems on Earth
          </p>
        </motion.div>

        {/* Elevation Stats */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {elevationData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <item.icon className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
              <div className="text-xs text-gray-500 font-medium">{item.unit}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Climate Zones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Climate Zones Profile
          </h3>
          <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
            {climateZones.map((zone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex-1 group cursor-pointer"
              >
                <div className={`bg-gradient-to-b ${zone.gradient} rounded-xl min-h-[240px] flex flex-col justify-between p-5 relative overflow-hidden transition-transform hover:scale-[1.02]`}>
                  <div className="text-4xl mb-2">{zone.image}</div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-white font-bold text-sm">{zone.name}</div>
                    <div className="text-white/70 text-xs mt-1">{zone.elevation}</div>
                    <div className="text-white/50 text-xs">{zone.temp}</div>
                    <div className="text-white/40 text-xs mt-1">{zone.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            India spans 29° of latitude — from the snow-capped Himalayas to the tropical rainforests and arid deserts
          </p>
        </motion.div>
      </div>
    </section>
  );
}
