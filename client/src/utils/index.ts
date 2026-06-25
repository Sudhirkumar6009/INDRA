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
  if (score >= 80) return 'text-red-600';
  if (score >= 60) return 'text-orange-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-green-600';
}

export function getTempColor(temp: number): string {
  if (temp >= 40) return '#ff4444';
  if (temp >= 35) return '#ff8844';
  if (temp >= 25) return '#ffcc44';
  if (temp >= 15) return '#4488ff';
  return '#4444ff';
}

export function getRainfallColor(rainfall: number): string {
  if (rainfall >= 200) return '#0000ff';
  if (rainfall >= 100) return '#4444ff';
  if (rainfall >= 50) return '#8888ff';
  if (rainfall >= 10) return '#ccccff';
  return '#f0f0f0';
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
