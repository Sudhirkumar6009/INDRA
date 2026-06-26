'use client';

import { motion } from 'framer-motion';
import { User, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navbar } from '@/components/common/Navbar';
import { useAppStore } from '@/store';

export default function ProfilePage() {
  const { auth } = useAppStore();

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-950">
      <Navbar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold text-green-900 dark:text-green-50 mb-2">User Profile</h1>
            <p className="text-green-700 dark:text-green-400">Manage your account information</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="dark:text-green-50">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-100 dark:bg-green-800 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400">Name</p>
                    <p className="font-semibold dark:text-green-50">{auth.user?.name || 'Guest User'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-100 dark:bg-green-800 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400">Email</p>
                    <p className="font-semibold dark:text-green-50">{auth.user?.email || 'guest@indra.gov.in'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-100 dark:bg-green-800 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-400">Member Since</p>
                    <p className="font-semibold dark:text-green-50">{auth.user?.createdAt ? new Date(auth.user.createdAt).toLocaleDateString('en-IN') : 'Today'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
