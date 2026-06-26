'use client';

import { motion } from 'framer-motion';
import { Cloud, Droplets, TrendingUp, MapPin, Zap, Shield, Database, Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/common/Navbar';

export default function Home() {
  const stats = [
    { icon: Database, value: '2.5M+', label: 'Data Points' },
    { icon: MapPin, value: '36 States', label: 'Coverage' },
    { icon: Activity, value: '98%', label: 'Accuracy' },
    { icon: TrendingUp, value: '15 Years', label: 'Historical Data' },
  ];

  const features = [
    {
      icon: Cloud,
      title: 'Real-time Monitoring',
      description: 'Live climate data from IMD and INSAT satellites across India',
    },
    {
      icon: Zap,
      title: 'AI Predictions',
      description: 'Advanced machine learning models for accurate climate forecasting',
    },
    {
      icon: Shield,
      title: 'Digital Twin',
      description: 'What-if simulations to predict climate scenarios and impacts',
    },
  ];

  const datasets = ['IMD', 'INSAT', 'MOSDAC', 'Bhuvan'];

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-950">
      <Navbar />
      
      {/* Hero Section */}
      <main className="pt-16">
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <motion.div
                className="mb-8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-7xl md:text-9xl font-bold mb-2">
                  <span className="text-green-600">IND</span>
                  <span className="text-green-700">RA</span>
                </h1>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-green-900 dark:text-green-50 mb-4"
              >
                Integrated National Digital Replica of Atmosphere
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-green-700 dark:text-green-300 mb-8 max-w-3xl mx-auto"
              >
                AI-Powered Climate Intelligence Platform for Monitoring, Prediction & Scenario Analysis
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-600/90 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl"
                  >
                    Launch Dashboard
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  className="bg-white dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <div className="text-3xl font-bold text-green-900 dark:text-green-50 mb-1">{stat.value}</div>
                  <div className="text-sm text-green-700 dark:text-green-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-green-100 dark:bg-green-900">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-green-900 dark:text-green-50 mb-4">
                Platform Capabilities
              </h2>
              <p className="text-xl text-green-700 dark:text-green-300 max-w-2xl mx-auto">
                Comprehensive climate intelligence powered by India's national datasets
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-white dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl p-8 hover:border-green-600 hover:shadow-xl transition-all"
                >
                  <div className="bg-green-600/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-50 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-green-700 dark:text-green-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Datasets Section */}
        <section className="py-20 bg-green-50 dark:bg-green-950">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-green-900 dark:text-green-50 mb-4">
                Integrated Data Sources
              </h2>
              <p className="text-xl text-green-700 dark:text-green-300">
                Powered by ISRO and IMD national infrastructure
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {datasets.map((dataset, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-green-900 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 text-center hover:border-green-500 hover:shadow-lg transition-all"
                >
                  <div className="text-2xl font-bold text-green-900 dark:text-green-50">{dataset}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-100 dark:bg-green-900">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-green-900 dark:text-green-50 mb-6">
                Start Exploring Climate Intelligence
              </h2>
              <p className="text-xl text-green-700 dark:text-green-300 mb-8">
                Access real-time data, AI predictions, and scenario simulations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-600/90 text-white px-8"
                  >
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-green-950 border-t border-green-200 dark:border-green-900 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl font-bold">
              <span className="text-green-600">IND</span>
              <span className="text-green-700">RA</span>
            </span>
          </div>
          <p className="text-green-700 dark:text-green-400">
            &copy; 2024 INDRA Climate Intelligence Platform. Powered by ISRO & IMD Data
          </p>
        </div>
      </footer>
    </div>
  );
}
