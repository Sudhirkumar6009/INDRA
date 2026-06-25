'use client';

import { motion } from 'framer-motion';
import { Satellite, Cloud, Thermometer, Droplets, TrendingUp, Database } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/common/Navbar';

export default function Home() {
  const stats = [
    { icon: Cloud, value: '2.5M+', label: 'Data Points' },
    { icon: Thermometer, value: '36 States', label: 'Coverage' },
    { icon: Droplets, value: '98%', label: 'Accuracy' },
    { icon: TrendingUp, value: '15 Years', label: 'Historical Data' },
  ];

  const datasets = [
    { name: 'IMD', desc: 'India Meteorological Department' },
    { name: 'INSAT', desc: 'Indian National Satellite System' },
    { name: 'MOSDAC', desc: 'Meteorological & Oceanographic Data' },
    { name: 'Bhuvan', desc: 'ISRO Geoportal' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-isro-blue to-blue-900">
      <Navbar />
      
      <main className="pt-24">
        <section className="container mx-auto px-6 py-20 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="relative"
              >
                <Satellite className="h-24 w-24 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              INDRA
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-blue-100">
              Integrated National Digital Replica of Atmosphere
            </p>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              AI-Powered Digital Twin of India's Climate for Monitoring, Prediction & Scenario Intelligence
            </p>

            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-isro-blue hover:bg-gray-100 text-lg px-8 py-6">
                Start Dashboard
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4 text-isro-blue">About INDRA</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              INDRA is India's first comprehensive AI-powered climate intelligence platform that creates a digital twin
              of the nation's atmosphere, enabling real-time monitoring, predictive analytics, and scenario simulations.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6">
                <div className="bg-isro-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Cloud className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
                <p className="text-gray-600">
                  Live climate data visualization across all Indian states and districts
                </p>
              </div>
              <div className="text-center p-6">
                <div className="bg-isro-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Predictions</h3>
                <p className="text-gray-600">
                  Advanced machine learning models for accurate climate forecasting
                </p>
              </div>
              <div className="text-center p-6">
                <div className="bg-isro-blue text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Digital Twin</h3>
                <p className="text-gray-600">
                  What-if simulations to predict climate scenarios and impacts
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Integrated Datasets</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {datasets.map((dataset, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div className="text-lg font-bold text-isro-blue mb-2">{dataset.name}</div>
                    <div className="text-sm text-gray-600">{dataset.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-isro-blue text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 INDRA - Climate Intelligence Platform. Powered by ISRO & IMD Data</p>
        </div>
      </footer>
    </div>
  );
}
