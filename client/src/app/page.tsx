'use client';

import { motion } from 'framer-motion';
import { Cloud, Droplets, TrendingUp, MapPin, Zap, Shield, Database, Activity, ArrowRight, Satellite, Globe, BarChart3, Twitter, Github, Linkedin, Mail, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/common/Navbar';
import { IndiaElevation } from '@/components/common/IndiaElevation';

const heroStats = [
  { icon: Satellite, value: '2.5M+', label: 'Data Points' },
  { icon: Globe, value: '36 States', label: 'Coverage' },
  { icon: Activity, value: '98.2%', label: 'Accuracy' },
  { icon: BarChart3, value: '15+ Years', label: 'Historical' },
];

const features = [
  {
    icon: Cloud,
    title: 'Real-time Monitoring',
    description: 'Live climate data streaming from IMD ground stations, INSAT satellites, and MOSDAC infrastructure across all Indian regions.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Predictions',
    description: 'Advanced deep learning models forecasting temperature, rainfall, and extreme weather events with 98.2% accuracy.',
  },
  {
    icon: Shield,
    title: 'Digital Twin Simulation',
    description: 'What-if scenario engine modeling climate impacts on agriculture, water resources, and urban infrastructure.',
  },
  {
    icon: MapPin,
    title: 'Geospatial Analytics',
    description: 'Interactive maps with district-level climate data, elevation profiles, and multi-layer environmental intelligence.',
  },
];

const dataSources = [
  { name: 'IMD', full: 'India Meteorological Department', desc: 'Ground weather stations & radar' },
  { name: 'INSAT', full: 'Indian National Satellite System', desc: 'Geostationary atmospheric imaging' },
  { name: 'MOSDAC', full: 'Meteorological & Oceanographic Satellite Data Centre', desc: 'Satellite data processing' },
  { name: 'Bhuvan', full: 'ISRO Geoportal', desc: 'High-resolution terrain mapping' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%23000' width='1920' height='1080'/%3E%3C/svg%3E"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo */}
              <div className="text-6xl md:text-7xl font-bold tracking-wider mb-6">
                <span className="text-[#FF9933]">I</span>
                <span className="text-white">N</span>
                <span className="text-green-500">D</span>
                <span className="text-blue-400">R</span>
                <span className="text-blue-400">A</span>
              </div>

              <p className="text-green-400 text-sm font-medium tracking-widest uppercase mb-4">
                Integrated National Digital Replica of Atmosphere
              </p>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Climate Intelligence<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-[#FF9933]">
                  for a Resilient India
                </span>
              </h2>

              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
                India&apos;s first AI-powered digital twin of the atmosphere — monitoring across 36 states 
                using IMD, INSAT, and ISRO infrastructure to predict, simulate, and safeguard against climate challenges.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-green-600 hover:bg-green-500 text-white px-8 text-base shadow-lg shadow-green-600/25 hover:shadow-green-500/40 transition-all">
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 text-base">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Trust Line */}
              <div className="flex items-center gap-4 mt-10 text-sm text-gray-400">
                <div className="flex -space-x-2">
                  {['IMD', 'ISRO', 'MOSDAC'].map((s, i) => (
                    <span key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-gray-300">
                      {s[0]}
                    </span>
                  ))}
                </div>
                <span>Powered by India&apos;s national climate infrastructure</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== INDIA ELEVATION SECTION ===== */}
      <IndiaElevation />

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Platform Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-4">
              Everything You Need for Climate Intelligence
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From real-time monitoring to AI-driven predictions — INDRA provides a complete toolkit for understanding and acting on climate data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-green-500 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                  <feature.icon className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DATA SOURCES SECTION ===== */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">National Infrastructure</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-4">
              Powered by India&apos;s Finest Data Networks
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              INDRA integrates data from India&apos;s premier meteorological and space agencies to deliver accurate, real-time climate intelligence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {dataSources.map((source, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-all"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{source.name}</div>
                <div className="text-xs text-green-600 font-medium mb-2">{source.full}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{source.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Integration Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: '120+', label: 'Ground Stations' },
                { value: '6', label: 'INSAT Satellites' },
                { value: '500TB+', label: 'Data Processed' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{item.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,163,74,0.15),transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-green-400 font-semibold text-sm uppercase tracking-wider">Join the Mission</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
              Ready to Transform Climate Intelligence?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join India&apos;s climate scientists, researchers, and policymakers in building a climate-resilient future with real-time data and AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-green-600 hover:bg-green-500 text-white px-10 text-base shadow-lg shadow-green-600/25">
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="border-gray-500 text-gray-300 hover:bg-white/10 hover:text-white px-10 text-base">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-green-500 to-blue-500" />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-1">
              <div className="text-3xl font-bold tracking-wide mb-4">
                <span className="text-[#FF9933]">I</span>
                <span className="text-white">N</span>
                <span className="text-green-500">D</span>
                <span className="text-blue-400">R</span>
                <span className="text-blue-400">A</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Integrated National Digital Replica of Atmosphere — an AI-powered climate intelligence platform monitoring, predicting, and analyzing India&apos;s atmospheric systems in real-time.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Mail, href: '#', label: 'Email' },
                ].map((s, idx) => (
                  <a key={idx} href={s.href} aria-label={s.label} className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Platform</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Dashboard', href: '/dashboard' },
                  { name: 'Interactive Map', href: '/map' },
                  { name: 'Climate Data', href: '/climate-data' },
                  { name: 'AI Predictions', href: '/predictions' },
                  { name: 'Simulations', href: '/simulations' },
                  { name: 'Analytics', href: '/analytics' },
                ].map((l, idx) => (
                  <li key={idx}>
                    <Link href={l.href} className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-green-500 rounded-full" />
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Data Sources</h3>
              <ul className="space-y-3">
                {[
                  { name: 'IMD', desc: 'India Meteorological Dept' },
                  { name: 'INSAT', desc: 'Indian Satellites' },
                  { name: 'MOSDAC', desc: 'Space Applications' },
                  { name: 'Bhuvan', desc: 'ISRO Geoportal' },
                  { name: 'CWC', desc: 'Water Commission' },
                  { name: 'NRSC', desc: 'Remote Sensing Centre' },
                ].map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Cloud size={14} className="mt-0.5 text-green-500 shrink-0" />
                    <div>
                      <div className="text-gray-200 text-sm font-medium">{s.name}</div>
                      <div className="text-gray-600 text-xs">{s.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Impact</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-2xl font-bold text-white">2.5M+</div>
                      <div className="text-xs text-gray-400">Data Points</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">36</div>
                      <div className="text-xs text-gray-400">States Covered</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">98%</div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">15yr</div>
                      <div className="text-xs text-gray-400">Historical</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Shield size={14} />
                  <span>Powered by ISRO & IMD national infrastructure</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe size={14} />
              <span>&copy; {new Date().getFullYear()} INDRA Climate Intelligence Platform</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-gray-300 transition-colors">Data Attribution</a>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              Built with <Heart size={12} className="text-red-400" /> for India&apos;s Climate Intelligence
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
