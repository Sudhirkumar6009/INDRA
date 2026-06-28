/**
 * idw_worker.js
 * Web Worker for Inverse Distance Weighting (IDW) interpolation.
 *
 * Receives data points and grid parameters via postMessage,
 * computes the interpolated grid on a background thread,
 * then returns the Float32Array result.
 *
 * This keeps the main UI thread responsive — no freezing even
 * with 10,000+ data points.
 */

self.onmessage = function (e) {
  const { points, gridW, gridH, bounds, idwPower, kNeighbors } = e.data;

  const { minLon, maxLon, minLat, maxLat } = bounds;
  const lonStep = (maxLon - minLon) / gridW;
  const latStep = (maxLat - minLat) / gridH;

  // Pre-extract point coordinates into flat arrays for cache-friendly access
  const n = points.length;
  const px = new Float64Array(n);
  const py = new Float64Array(n);
  const pv = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    px[i] = points[i].lon;
    py[i] = points[i].lat;
    pv[i] = points[i].value;
  }

  // Allocate the output grid
  const grid = new Float32Array(gridW * gridH);

  // --- IDW interpolation ---
  // For each pixel in the grid, find K nearest data points and compute
  // weighted average: value = Σ(w_i * v_i) / Σ(w_i), where w_i = 1/d_i^p
  for (let row = 0; row < gridH; row++) {
    // lat goes top-to-bottom in image coordinates (row 0 = maxLat)
    const lat = maxLat - row * latStep;

    for (let col = 0; col < gridW; col++) {
      const lon = minLon + col * lonStep;

      // Compute squared distances to all points (avoid sqrt for sorting)
      // We'll use actual distance for the weight calculation
      let exactHit = -1;
      const dists = new Float64Array(n);

      for (let i = 0; i < n; i++) {
        const dx = px[i] - lon;
        const dy = py[i] - lat;
        dists[i] = dx * dx + dy * dy;  // squared distance

        // Check for exact hit (within ~100m)
        if (dists[i] < 1e-6) {
          exactHit = i;
        }
      }

      // If we landed exactly on a station, use its value directly
      if (exactHit >= 0) {
        grid[row * gridW + col] = pv[exactHit];
        continue;
      }

      // Find K nearest neighbors using partial sort
      // For small K (8), a simple selection is faster than full sort
      const k = Math.min(kNeighbors, n);
      const nearest = new Array(k);
      const nearDist = new Float64Array(k);
      nearDist.fill(Infinity);

      for (let i = 0; i < n; i++) {
        // Find the position of the worst (farthest) neighbor
        let worstIdx = 0;
        for (let j = 1; j < k; j++) {
          if (nearDist[j] > nearDist[worstIdx]) worstIdx = j;
        }
        // If this point is closer than the worst, replace it
        if (dists[i] < nearDist[worstIdx]) {
          nearDist[worstIdx] = dists[i];
          nearest[worstIdx] = i;
        }
      }

      // Compute IDW weighted average using actual distances
      let weightSum = 0;
      let valueSum = 0;
      for (let j = 0; j < k; j++) {
        if (nearDist[j] === Infinity) continue;
        const dist = Math.sqrt(nearDist[j]);  // actual distance
        const w = 1 / Math.pow(dist, idwPower);
        weightSum += w;
        valueSum += w * pv[nearest[j]];
      }

      grid[row * gridW + col] = weightSum > 0 ? valueSum / weightSum : 0;
    }

    // Report progress every 40 rows (~10% increments)
    if (row % 40 === 0) {
      self.postMessage({
        type: 'progress',
        percent: Math.round((row / gridH) * 100),
      });
    }
  }

  // --- Gaussian blur post-processing ---
  // Apply a 3×3 Gaussian kernel to smooth out IDW discontinuities
  // where the K-nearest set changes. This creates the silk-like quality
  // seen in Windy/Ventusky visualizations.
  const blurred = new Float32Array(gridW * gridH);
  const kernel = [
    1, 2, 1,
    2, 4, 2,
    1, 2, 1,
  ];
  const kernelSum = 16; // sum of all kernel weights

  for (let row = 0; row < gridH; row++) {
    for (let col = 0; col < gridW; col++) {
      let sum = 0;
      let wSum = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const r = row + ky;
          const c = col + kx;
          if (r >= 0 && r < gridH && c >= 0 && c < gridW) {
            const w = kernel[(ky + 1) * 3 + (kx + 1)];
            sum += grid[r * gridW + c] * w;
            wSum += w;
          }
        }
      }
      blurred[row * gridW + col] = sum / wSum;
    }
  }

  // Transfer the blurred grid back to the main thread
  self.postMessage({
    type: 'result',
    grid: blurred.buffer,
  }, [blurred.buffer]);
};
