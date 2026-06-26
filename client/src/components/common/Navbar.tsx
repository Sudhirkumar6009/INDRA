'use client';

import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth, logout } = useAppStore();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Map', href: '/map' },
    { name: 'Climate Data', href: '/climate-data' },
    { name: 'Predictions', href: '/predictions' },
    { name: 'Analytics', href: '/analytics' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full bg-white/95 dark:bg-green-950/95 backdrop-blur-sm border-b border-green-100 dark:border-green-900 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center font-bold text-2xl">
              <span className="text-green-600">IND</span>
              <span className="text-green-700">RA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-green-700 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 font-medium rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transition-all"
              >
                {link.name}
              </Link>
            ))}
            
            <ThemeToggle />
            
            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-4">
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="hover:bg-green-50 dark:hover:bg-green-900">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white dark:border-green-600 dark:text-green-400"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth" className="ml-4">
                <Button className="bg-green-600 hover:bg-green-600/90 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
                    className="block px-4 py-2 text-green-700 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
                {auth.isAuthenticated ? (
                  <Button 
                    variant="outline" 
                    onClick={logout} 
                    className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    Logout
                  </Button>
                ) : (
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-green-600 hover:bg-green-600/90">
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
