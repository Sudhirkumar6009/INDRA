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
  color?: 'green' | 'default';
}

export const StatsCard = ({ title, value, icon: Icon, trend, color = 'default' }: StatsCardProps) => {
  const iconColors = {
    green: 'text-green-600',
    default: 'text-green-700',
  };

  const borderColors = {
    green: 'hover:border-green-600',
    default: 'hover:border-green-400',
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
          <CardTitle className="text-sm font-semibold text-green-700">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${iconColors[color]}`} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">{value}</div>
          {trend && (
            <p className="text-xs text-green-700 mt-2">
              <span className={trend.value >= 0 ? 'text-green-600 font-semibold' : 'text-green-800 font-semibold'}>
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
