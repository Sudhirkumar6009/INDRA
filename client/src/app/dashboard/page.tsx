'use client';

import { motion } from 'framer-motion';
import { Cloud, Droplets, Thermometer, Wind, MapPin, TrendingUp, AlertTriangle, Database } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/common/Navbar';

export default function DashboardPage() {
  const stats = [
    { icon: Droplets, label: 'Avg Rainfall', value: '1,250 mm', change: '+5%', trend: 'up' },
    { icon: Thermometer, label: 'Avg Temperature', value: '28.5°C', change: '+1.2°C', trend: 'up' },
    { icon: Wind, label: 'Wind Speed', value: '12 km/h', change: '-3%', trend: 'down' },
    { icon: Cloud, label: 'Cloud Coverage', value: '45%', change: '+8%', trend: 'up' },
  ];

  const alerts = [
    { type: 'heatwave', severity: 'high', region: 'Rajasthan', message: 'Heatwave conditions expected' },
    { type: 'heavy_rainfall', severity: 'medium', region: 'Kerala', message: 'Heavy rainfall forecast' },
    { type: 'drought', severity: 'low', region: 'Karnataka', message: 'Low rainfall warning' },
  ];

  const quickActions = [
    { icon: MapPin, title: 'Interactive Map', description: 'Explore climate data', href: '/map', color: 'green-600' },
    { icon: Database, title: 'Climate Data', description: 'View detailed datasets', href: '/climate-data', color: 'green-600' },
    { icon: TrendingUp, title: 'AI Predictions', description: 'Forecast analytics', href: '/predictions', color: 'green-600' },
    { icon: Cloud, title: 'Simulations', description: 'What-if scenarios', href: '/simulations', color: 'green-700' },
  ];

  const severityColor = {
    low: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-green-200 text-green-800 border-green-400',
    high: 'bg-green-300 text-green-900 border-green-500',
    critical: 'bg-green-400 text-green-950 border-green-600',
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-950">
      <Navbar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-green-900 dark:text-green-50 mb-2">Climate Dashboard</h1>
            <p className="text-green-700 dark:text-green-400">National climate intelligence overview for India</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, idx) => (
              <Card key={idx} className="hover:border-green-500 transition-all dark:bg-green-900 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-green-900 dark:text-green-50">{stat.value}</p>
                      <p className={`text-sm mt-2 ${stat.trend === 'up' ? 'text-green-800' : 'text-green-600'}`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className="bg-green-600/10 p-3 rounded-lg">
                      <stat.icon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 dark:text-green-50">
                    <AlertTriangle className="h-6 w-6 text-green-600" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${severityColor[alert.severity as keyof typeof severityColor]}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{alert.region}</p>
                          <p className="text-sm mt-1">{alert.message}</p>
                        </div>
                        <span className="text-xs font-bold uppercase px-2 py-1 bg-white rounded">
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="dark:text-green-50">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400">Date</p>
                    <p className="text-lg font-semibold dark:text-green-50">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400">Active Alerts</p>
                    <p className="text-lg font-semibold dark:text-green-50">{alerts.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400">States Monitored</p>
                    <p className="text-lg font-semibold dark:text-green-50">36</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400">Data Sources</p>
                    <p className="text-lg font-semibold dark:text-green-50">IMD, INSAT, MOSDAC</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-50 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, idx) => (
                <Link key={idx} href={action.href}>
                  <Card className="hover:border-green-500 hover:shadow-lg transition-all cursor-pointer h-full dark:bg-green-900 dark:border-green-800">
                    <CardContent className="p-6">
                      <div className={`bg-${action.color}/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <action.icon className={`h-6 w-6 text-${action.color}`} />
                      </div>
                      <h3 className="font-bold text-lg mb-2 dark:text-green-50">{action.title}</h3>
                      <p className="text-sm text-green-700 dark:text-green-400">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
