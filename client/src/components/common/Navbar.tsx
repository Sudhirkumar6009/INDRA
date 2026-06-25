'use client';

import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center font-bold text-2xl">
              <span className="text-india-saffron">IND</span>
              <span className="text-india-green">RA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-gray-700 hover:text-india-saffron font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                {link.name}
              </Link>
            ))}
            
            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="border-india-saffron text-india-saffron hover:bg-india-saffron hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" className="ml-4">
                <Button className="bg-india-saffron hover:bg-india-saffron/90 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:text-india-saffron hover:bg-gray-50 rounded-lg font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
                {auth.isAuthenticated ? (
                  <Button 
                    variant="outline" 
                    onClick={logout} 
                    className="w-full border-india-saffron text-india-saffron hover:bg-india-saffron hover:text-white"
                  >
                    Logout
                  </Button>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-india-saffron hover:bg-india-saffron/90">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
