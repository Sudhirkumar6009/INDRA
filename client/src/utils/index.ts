import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTemp(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

export function formatRainfall(rainfall: number): string {
  return `${rainfall.toFixed(1)} mm`;
}

export function getRiskColor(score: number): string {
  if (score >= 80) return 'text-green-800';
  if (score >= 60) return 'text-green-700';
  if (score >= 40) return 'text-green-600';
  return 'text-green-500';
}

export function getTempColor(temp: number): string {
  if (temp >= 40) return '#166534';
  if (temp >= 35) return '#15803d';
  if (temp >= 25) return '#16a34a';
  if (temp >= 15) return '#22c55e';
  return '#4ade80';
}

export function getRainfallColor(rainfall: number): string {
  if (rainfall >= 200) return '#166534';
  if (rainfall >= 100) return '#15803d';
  if (rainfall >= 50) return '#16a34a';
  if (rainfall >= 10) return '#22c55e';
  return '#86efac';
}

export function calculateAnomaly(current: number, historical: number): number {
  return ((current - historical) / historical) * 100;
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return 'Very High';
  if (confidence >= 0.75) return 'High';
  if (confidence >= 0.6) return 'Moderate';
  return 'Low';
}
