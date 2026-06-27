import type { MonthlyDataPoint } from "@/types";

function deg2rad(d: number) {
  return (d * Math.PI) / 180;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nNearest(
  data: MonthlyDataPoint[],
  lat: number,
  lon: number,
  n: number,
): { point: MonthlyDataPoint; dist: number }[] {
  const withDist = data.map((p) => ({
    point: p,
    dist: haversineKm(lat, lon, p.lat, p.lon),
  }));
  withDist.sort((a, b) => a.dist - b.dist);
  return withDist.slice(0, n);
}

function getValue(p: MonthlyDataPoint, isRain: boolean): number | null {
  if (isRain) return p.rainfall;
  return p.maxTemp ?? p.minTemp;
}

export function idwValue(
  data: MonthlyDataPoint[],
  lat: number,
  lon: number,
  isRain: boolean,
  power = 2,
  neighbors = 12,
): number | null {
  const nearest = nNearest(data, lat, lon, neighbors);
  let numSum = 0;
  let denom = 0;
  for (const { point, dist } of nearest) {
    if (dist < 0.01) return getValue(point, isRain);
    const w = 1 / dist ** power;
    const v = getValue(point, isRain);
    if (v === null || v === undefined) continue;
    numSum += w * v;
    denom += w;
  }
  return denom > 0 ? numSum / denom : null;
}

function mer(lat: number) {
  return Math.log(Math.tan(Math.PI / 4 + deg2rad(lat) / 2));
}

export function idwGridMercator(
  data: MonthlyDataPoint[],
  isRain: boolean,
  width: number,
  height: number,
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number },
): number[][] {
  const minMY = mer(bounds.minLat);
  const maxMY = mer(bounds.maxLat);
  const myRng = maxMY - minMY;
  const invMer = (y: number) =>
    (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * (180 / Math.PI);

  const grid: number[][] = [];
  for (let py = 0; py < height; py++) {
    grid[py] = [];
    const my = maxMY - (py / height) * myRng;
    const lat = invMer(my);
    if (lat < bounds.minLat - 0.01 || lat > bounds.maxLat + 0.01) {
      for (let px = 0; px < width; px++) grid[py][px] = -999;
      continue;
    }
    for (let px = 0; px < width; px++) {
      const lon = bounds.minLon + (px / width) * (bounds.maxLon - bounds.minLon);
      grid[py][px] = idwValue(data, lat, lon, isRain) ?? 0;
    }
  }
  return grid;
}

export function krigingValue(
  data: MonthlyDataPoint[],
  lat: number,
  lon: number,
  isRain: boolean,
  neighbors = 16,
): number | null {
  const nearest = nNearest(data, lat, lon, neighbors);
  const pts = nearest.filter((n) => getValue(n.point, isRain) !== null);
  if (pts.length < 4) {
    if (pts.length === 0 || pts[0].dist < 0.01)
      return pts.length > 0 ? getValue(pts[0].point, isRain) : null;
  }

  const values = pts.map((n) => getValue(n.point, isRain) as number);
  const distances = pts.map((n) => n.dist);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;

  const nugget = 0;
  const sill = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  const maxDist = Math.max(...distances);
  const range = maxDist > 0 ? maxDist / 1.5 : 1;

  function spherical(h: number) {
    if (h <= 0) return nugget;
    if (h >= range) return nugget + sill;
    const r = h / range;
    return nugget + sill * (1.5 * r - 0.5 * r * r * r);
  }

  const n = pts.length;
  const A: number[][] = [];
  for (let i = 0; i < n; i++) {
    A[i] = [];
    for (let j = 0; j < n; j++) {
      A[i][j] = spherical(distances[i] > 0 ? distances[i] : 0.01);
    }
    A[i][n] = 1;
  }
  const lastRow = new Array(n + 1).fill(1);
  lastRow[n] = 0;
  A.push(lastRow);

  const b = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    b[i] = spherical(pts[i].dist > 0.01 ? pts[i].dist : 0.01);
  }
  b[n] = 1;

  const w = solveLinear(A, b);
  if (!w) return mean;

  let result = 0;
  for (let i = 0; i < n; i++) result += w[i] * values[i];
  return result;
}

function solveLinear(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const m: number[][] = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(m[row][col]) > Math.abs(m[maxRow][col])) maxRow = row;
    }
    [m[col], m[maxRow]] = [m[maxRow], m[col]];
    if (Math.abs(m[col][col]) < 1e-12) return null;
    for (let row = col + 1; row < n; row++) {
      const factor = m[row][col] / m[col][col];
      for (let j = col; j <= n; j++) m[row][j] -= factor * m[col][j];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = m[i][n];
    for (let j = i + 1; j < n; j++) sum -= m[i][j] * x[j];
    x[i] = sum / m[i][i];
  }
  return x;
}

export function krigingGridMercator(
  data: MonthlyDataPoint[],
  isRain: boolean,
  width: number,
  height: number,
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number },
): number[][] {
  const minMY = mer(bounds.minLat);
  const maxMY = mer(bounds.maxLat);
  const myRng = maxMY - minMY;
  const invMer = (y: number) =>
    (2 * Math.atan(Math.exp(y)) - Math.PI / 2) * (180 / Math.PI);

  const grid: number[][] = [];
  for (let py = 0; py < height; py++) {
    grid[py] = [];
    const my = maxMY - (py / height) * myRng;
    const lat = invMer(my);
    if (lat < bounds.minLat - 0.01 || lat > bounds.maxLat + 0.01) {
      for (let px = 0; px < width; px++) grid[py][px] = -999;
      continue;
    }
    for (let px = 0; px < width; px++) {
      const lon = bounds.minLon + (px / width) * (bounds.maxLon - bounds.minLon);
      grid[py][px] = krigingValue(data, lat, lon, isRain) ?? 0;
    }
  }
  return grid;
}

export function classifyGrid(
  grid: number[][],
  breaks: number[],
): number[][] {
  const h = grid.length;
  const w = grid[0].length;
  const classified: number[][] = [];
  for (let y = 0; y < h; y++) {
    classified[y] = [];
    for (let x = 0; x < w; x++) {
      const v = grid[y][x];
      let cls = 0;
      for (let i = 0; i < breaks.length; i++) {
        if (v >= breaks[i]) cls = i + 1;
      }
      classified[y][x] = cls;
    }
  }
  return classified;
}
