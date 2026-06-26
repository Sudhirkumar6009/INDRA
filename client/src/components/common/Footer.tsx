'use client';

import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-green-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-green-600">IND</span>
              <span className="text-green-700">RA</span>
            </div>
            <p className="text-green-700">
              Climate Intelligence Platform for India's Future
            </p>
          </div>

          <div>
            <h3 className="font-bold text-green-900 mb-4">Platform</h3>
            <ul className="space-y-2 text-green-700">
              <li><a href="/dashboard" className="hover:text-green-600 transition-colors">Dashboard</a></li>
              <li><a href="/predictions" className="hover:text-green-600 transition-colors">Predictions</a></li>
              <li><a href="/simulations" className="hover:text-green-600 transition-colors">Simulations</a></li>
              <li><a href="/analytics" className="hover:text-green-600 transition-colors">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-green-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-green-700">
              <li><a href="#" className="hover:text-green-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Datasets</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-green-900 mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-green-700 hover:text-green-600 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-green-700 hover:text-green-600 transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="text-green-700 hover:text-green-600 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-green-700 hover:text-green-600 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-200 pt-8 text-center">
          <p className="text-green-700">
            &copy; 2024 INDRA. Powered by ISRO & IMD. Built with ❤️ for India's Climate Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
};
