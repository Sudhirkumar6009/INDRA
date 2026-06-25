'use client';

import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-india-saffron">IND</span>
              <span className="text-india-green">RA</span>
            </div>
            <p className="text-gray-600">
              Climate Intelligence Platform for India's Future
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/dashboard" className="hover:text-india-saffron transition-colors">Dashboard</a></li>
              <li><a href="/predictions" className="hover:text-india-saffron transition-colors">Predictions</a></li>
              <li><a href="/simulations" className="hover:text-india-saffron transition-colors">Simulations</a></li>
              <li><a href="/analytics" className="hover:text-india-saffron transition-colors">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-india-saffron transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-india-saffron transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-india-saffron transition-colors">Datasets</a></li>
              <li><a href="#" className="hover:text-india-saffron transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-india-saffron transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-india-saffron transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-india-saffron transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-india-saffron transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600">
            &copy; 2024 INDRA. Powered by ISRO & IMD. Built with ❤️ for India's Climate Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
};
