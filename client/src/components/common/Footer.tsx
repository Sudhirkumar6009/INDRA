'use client';

import { Github, Twitter, Linkedin, Mail, Heart, Globe, Shield, Cloud } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="h-1 bg-gradient-to-r from-[#FF9933] via-green-500 to-blue-500" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
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
                <a
                  key={idx}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Platform</h3>
            <ul className="space-y-3">
              {[
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Interactive Map', href: '/map' },
                { name: 'Climate Data', href: '/climate-data' },
                { name: 'AI Predictions', href: '/predictions' },
                { name: 'Simulations', href: '/simulations' },
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

          {/* Data Sources */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Data Sources</h3>
            <ul className="space-y-3">
              {[
                { name: 'IMD', desc: 'India Meteorological Dept' },
                { name: 'INSAT', desc: 'Indian Satellites' },
                { name: 'MOSDAC', desc: 'Space Applications' },
                { name: 'Bhuvan', desc: 'ISRO Geoportal' },
                { name: 'CWC', desc: 'Water Commission' },
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

          {/* Impact */}
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
                <span>Powered by ISRO & IMD infrastructure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Globe size={14} />
            <span>&copy; {year} INDRA Climate Intelligence Platform</span>
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
  );
};
