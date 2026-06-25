'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'saffron' | 'green' | 'default';
}

export const StatsCard = ({ title, value, icon: Icon, trend, color = 'default' }: StatsCardProps) => {
  const iconColors = {
    saffron: 'text-india-saffron',
    green: 'text-india-green',
    default: 'text-gray-700',
  };

  const borderColors = {
    saffron: 'hover:border-india-saffron',
    green: 'hover:border-india-green',
    default: 'hover:border-gray-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={`${borderColors[color]} cursor-pointer`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${iconColors[color]}`} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {trend && (
            <p className="text-xs text-gray-600 mt-2">
              <span className={trend.value >= 0 ? 'text-india-green font-semibold' : 'text-red-600 font-semibold'}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>{' '}
              {trend.label}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
