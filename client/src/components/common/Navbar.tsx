'use client';

import { Satellite, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useAppStore();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Predictions', href: '/predictions' },
    { name: 'Simulations', href: '/simulations' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Datasets', href: '/datasets' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-isro-blue p-2 rounded-lg">
              <Satellite className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-isro-blue">INDRA</div>
              <div className="text-xs text-gray-600">Climate Intelligence Platform</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-isro-blue transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:text-isro-blue py-2"
              >
                {link.name}
              </Link>
            ))}
            {auth.isAuthenticated ? (
              <Button variant="outline" onClick={logout} className="w-full">
                Logout
              </Button>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
