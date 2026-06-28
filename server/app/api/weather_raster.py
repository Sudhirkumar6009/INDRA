"""
weather_raster.py
Server-side IDW interpolation → PNG raster endpoint.

Instead of sending raw data to the browser and computing IDW in JavaScript,
this endpoint does everything on the server using NumPy (vectorized, ~50ms)
and returns a ready-made PNG image. The browser just places it on the map.

Endpoint:
    GET /api/v1/weather/raster?date=2025-06-15&variable=rainfall&grid=400

Returns: image/png (RGBA, transparent outside data range)
"""

import io
import numpy as np
from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import cast, Date, func
from datetime import datetime
from app.database.db import get_db
from app.models.climate import ClimateData

try:
    from scipy.ndimage import gaussian_filter
    HAS_SCIPY = True
except ImportError:
    HAS_SCIPY = False

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

router = APIRouter(prefix="/weather", tags=["Weather Raster"])

# India bounding box — matches the frontend's expected overlay coordinates
INDIA_BOUNDS = {
    "minLon": 66.5, "maxLon": 100.0,
    "minLat": 6.5, "maxLat": 37.0,
}

# ─── Colormaps ─────────────────────────────────────────────────────
# Each colormap: list of (fraction, R, G, B, A) stops.
# Interpolated linearly between stops.

COLORMAPS = {
    "rainfall": {
        "minVal": 0, "maxVal": 200,
        "stops": [
            (0.00, 255, 255, 255,   0),   # transparent (no rain)
            (0.05, 173, 216, 255,  60),   # very light blue
            (0.15, 100, 180, 255, 120),   # light blue
            (0.30,  30, 144, 255, 160),   # dodger blue
            (0.50,   0,  80, 200, 180),   # medium blue
            (0.70,   0,  40, 160, 200),   # deep blue
            (0.85,   0,   0, 120, 220),   # dark blue
            (1.00, 100,   0, 200, 240),   # purple-blue (extreme)
        ],
    },
    "max_temp": {
        "minVal": 20, "maxVal": 48,
        "stops": [
            (0.00, 255, 255, 180,  80),   # pale yellow
            (0.20, 255, 200,  50, 140),   # yellow-orange
            (0.40, 255, 140,   0, 180),   # orange
            (0.60, 240,  70,   0, 200),   # deep orange
            (0.80, 200,  20,   0, 220),   # red-orange
            (1.00, 140,   0,   0, 240),   # dark red
        ],
    },
    "min_temp": {
        "minVal": 8, "maxVal": 34,
        "stops": [
            (0.00, 180, 240, 255,  80),   # pale cyan
            (0.25, 100, 200, 255, 130),   # light blue
            (0.50,  50, 150, 220, 170),   # medium blue
            (0.75, 100, 100, 200, 200),   # blue-purple
            (1.00, 150,  50, 180, 220),   # purple
        ],
    },
}


def _build_colormap_lut(stops: list, min_val: float, max_val: float) -> np.ndarray:
    """
    Build a 256-entry RGBA lookup table from colormap stops.
    Index 0 = minVal, index 255 = maxVal.
    """
    lut = np.zeros((256, 4), dtype=np.uint8)
    fractions = np.array([s[0] for s in stops])
    colors = np.array([[s[1], s[2], s[3], s[4]] for s in stops], dtype=np.float32)

    for i in range(256):
        t = i / 255.0
        # Find the two stops that bracket this t
        idx = np.searchsorted(fractions, t, side="right")
        if idx == 0:
            lut[i] = colors[0].astype(np.uint8)
        elif idx >= len(fractions):
            lut[i] = colors[-1].astype(np.uint8)
        else:
            t0 = fractions[idx - 1]
            t1 = fractions[idx]
            f = (t - t0) / (t1 - t0) if t1 > t0 else 0.0
            c = colors[idx - 1] * (1 - f) + colors[idx] * f
            lut[i] = np.clip(c, 0, 255).astype(np.uint8)

    return lut


def _idw_numpy(
    px: np.ndarray,  # shape (N,) — longitudes of data points
    py: np.ndarray,  # shape (N,) — latitudes of data points
    pv: np.ndarray,  # shape (N,) — values
    grid_w: int,
    grid_h: int,
    bounds: dict,
    power: float = 2.0,
    k: int = 8,
) -> np.ndarray:
    """
    Vectorized IDW interpolation using NumPy.
    Returns a (grid_h, grid_w) float32 array of interpolated values.

    ~50ms for 400×400 grid with 1000 points on a modern CPU.
    """
    min_lon, max_lon = bounds["minLon"], bounds["maxLon"]
    min_lat, max_lat = bounds["minLat"], bounds["maxLat"]

    # Build the target grid coordinates
    lons = np.linspace(min_lon, max_lon, grid_w)
    lats = np.linspace(max_lat, min_lat, grid_h)  # top-to-bottom
    glon, glat = np.meshgrid(lons, lats)  # (grid_h, grid_w)

    # Flatten grid for batch processing
    glon_flat = glon.ravel()  # (grid_h * grid_w,)
    glat_flat = glat.ravel()

    n_points = len(px)
    n_cells = len(glon_flat)

    # Compute distances from every grid cell to every data point
    # Shape: (n_cells, n_points)
    # To avoid memory issues with very large grids, process in chunks
    chunk_size = 10000  # process 10k grid cells at a time
    result = np.zeros(n_cells, dtype=np.float32)

    for start in range(0, n_cells, chunk_size):
        end = min(start + chunk_size, n_cells)
        gl = glon_flat[start:end, np.newaxis]  # (chunk, 1)
        ga = glat_flat[start:end, np.newaxis]  # (chunk, 1)

        # Squared distances: (chunk, n_points)
        dx = gl - px[np.newaxis, :]  # broadcast
        dy = ga - py[np.newaxis, :]
        dist_sq = dx * dx + dy * dy

        # Find k nearest for each cell
        if n_points <= k:
            # Use all points
            dist = np.sqrt(dist_sq)
            w = np.where(dist < 1e-8, 1e12, 1.0 / np.power(dist, power))
            weighted = w * pv[np.newaxis, :]
            result[start:end] = weighted.sum(axis=1) / w.sum(axis=1)
        else:
            # Partial sort to find k nearest
            k_indices = np.argpartition(dist_sq, k, axis=1)[:, :k]
            # Gather distances and values for k nearest
            rows = np.arange(end - start)[:, np.newaxis]
            k_dist_sq = dist_sq[rows, k_indices]
            k_values = pv[k_indices]

            k_dist = np.sqrt(k_dist_sq)
            w = np.where(k_dist < 1e-8, 1e12, 1.0 / np.power(k_dist, power))
            weighted = w * k_values
            result[start:end] = weighted.sum(axis=1) / w.sum(axis=1)

    return result.reshape(grid_h, grid_w)


@router.get("/raster")
def get_weather_raster(
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    variable: str = Query(
        default="rainfall",
        description="rainfall, max_temp, or min_temp",
    ),
    grid: int = Query(default=400, ge=100, le=800, description="Grid resolution"),
    blur: float = Query(default=1.2, ge=0, le=5, description="Gaussian blur sigma"),
    db: Session = Depends(get_db),
):
    """
    Returns a smooth IDW-interpolated weather raster as a PNG image.

    The server does all the heavy lifting:
    1. Queries data points from PostGIS
    2. Runs vectorized IDW interpolation (NumPy)
    3. Applies Gaussian blur for smoothness
    4. Applies colormap → RGBA pixels
    5. Encodes as PNG

    The browser just places the image as a map overlay — zero computation.
    """
    if not HAS_PIL:
        raise HTTPException(status_code=500, detail="Pillow not installed. Run: pip install Pillow")

    if variable not in COLORMAPS:
        raise HTTPException(status_code=400, detail=f"variable must be one of: {list(COLORMAPS.keys())}")

    is_monthly = len(date) == 7

    # ── 1. Query data points ──
    col_map = {
        "rainfall": ClimateData.rainfall,
        "max_temp": ClimateData.max_temp,
        "min_temp": ClimateData.min_temp,
    }
    value_col = col_map[variable]

    if is_monthly:
        try:
            parts = date.split("-")
            year = int(parts[0])
            month = int(parts[1])
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid monthly date format. Use YYYY-MM.")

        import calendar
        last_day = calendar.monthrange(year, month)[1]
        start_date = datetime(year, month, 1)
        end_date = datetime(year, month, last_day, 23, 59, 59)

        rows = db.query(
            ClimateData.lat,
            ClimateData.lon,
            func.avg(value_col).label("value"),
        ).filter(
            ClimateData.date >= start_date,
            ClimateData.date <= end_date,
            value_col.isnot(None),
            ClimateData.lat.isnot(None),
            ClimateData.lon.isnot(None),
        ).group_by(
            ClimateData.lat,
            ClimateData.lon
        ).all()
    else:
        try:
            target = datetime.fromisoformat(date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

        start_date = datetime(target.year, target.month, target.day, 0, 0, 0)
        end_date = datetime(target.year, target.month, target.day, 23, 59, 59)

        rows = db.query(
            ClimateData.lat,
            ClimateData.lon,
            value_col.label("value"),
        ).filter(
            ClimateData.date >= start_date,
            ClimateData.date <= end_date,
            value_col.isnot(None),
            ClimateData.lat.isnot(None),
            ClimateData.lon.isnot(None),
        ).all()

    if not rows:
        # Return a 1×1 transparent PNG if no data
        img = Image.new("RGBA", (1, 1), (0, 0, 0, 0))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return Response(content=buf.getvalue(), media_type="image/png")

    # ── 2. Extract NumPy arrays ──
    px = np.array([r.lon for r in rows], dtype=np.float64)
    py = np.array([r.lat for r in rows], dtype=np.float64)
    pv = np.array([r.value for r in rows], dtype=np.float64)

    # ── 3. IDW interpolation ──
    grid_values = _idw_numpy(px, py, pv, grid, grid, INDIA_BOUNDS, power=2.0, k=8)

    # ── 4. Gaussian blur ──
    if HAS_SCIPY and blur > 0:
        grid_values = gaussian_filter(grid_values, sigma=blur)

    # ── 5. Apply colormap ──
    cm = COLORMAPS[variable]
    lut = _build_colormap_lut(cm["stops"], cm["minVal"], cm["maxVal"])

    # Normalize to 0–255 index
    vmin, vmax = cm["minVal"], cm["maxVal"]
    normalized = np.clip((grid_values - vmin) / (vmax - vmin), 0, 1)
    indices = (normalized * 255).astype(np.uint8)

    # Map through LUT → RGBA
    rgba = lut[indices]  # shape (grid_h, grid_w, 4)

    # ── 6. Encode as PNG ──
    img = Image.fromarray(rgba, "RGBA")
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)

    return Response(
        content=buf.getvalue(),
        media_type="image/png",
        headers={
            "Cache-Control": "public, max-age=3600",
            "X-Data-Points": str(len(rows)),
            "X-Grid-Size": f"{grid}x{grid}",
        },
    )
