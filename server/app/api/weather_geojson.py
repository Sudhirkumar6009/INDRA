"""
weather_geojson.py
GeoJSON endpoints for the smooth IDW weather map frontend.

Queries the existing climate_data table and returns GeoJSON FeatureCollections
with Point geometries and a "value" property — the format expected by the
IDW interpolation frontend.
"""

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from datetime import datetime, date
from app.database.db import get_db
from app.models.climate import ClimateData

router = APIRouter(prefix="/weather", tags=["Weather GeoJSON"])


def _to_geojson(rows, value_attr: str) -> dict:
    """Convert SQLAlchemy rows to a GeoJSON FeatureCollection."""
    features = []
    for r in rows:
        lat = r.lat
        lon = r.lon
        val = getattr(r, value_attr, None)
        if lat is None or lon is None or val is None:
            continue
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(lon), float(lat)],
            },
            "properties": {
                "value": round(float(val), 2),
            },
        })
    return {"type": "FeatureCollection", "features": features}


@router.get("/rainfall")
def get_rainfall_geojson(
    date: str = Query(
        default="2024-06-28",
        description="Date in YYYY-MM-DD format",
    ),
    db: Session = Depends(get_db),
):
    """
    Return rainfall data as GeoJSON FeatureCollection for a given date.
    Each Feature has coordinates [lon, lat] and properties.value (rainfall_mm).
    """
    try:
        target = datetime.fromisoformat(date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    # Query all grid points for this date that have rainfall data.
    # The climate_data table stores date as DateTime, so we compare the date portion.
    rows = db.query(ClimateData).filter(
        cast(ClimateData.date, Date) == target.date(),
        ClimateData.rainfall.isnot(None),
        ClimateData.lat.isnot(None),
        ClimateData.lon.isnot(None),
    ).all()

    return _to_geojson(rows, "rainfall")


@router.get("/temperature")
def get_temperature_geojson(
    date: str = Query(
        default="2024-06-28",
        description="Date in YYYY-MM-DD format",
    ),
    field: str = Query(
        default="max",
        description="'max' for max_temp, 'min' for min_temp",
    ),
    db: Session = Depends(get_db),
):
    """
    Return temperature data as GeoJSON FeatureCollection for a given date.
    field='max' returns max_temp, field='min' returns min_temp.
    """
    try:
        target = datetime.fromisoformat(date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    if field not in ("max", "min"):
        raise HTTPException(status_code=400, detail="field must be 'max' or 'min'.")

    value_col = "max_temp" if field == "max" else "min_temp"
    col_filter = ClimateData.max_temp if field == "max" else ClimateData.min_temp

    rows = db.query(ClimateData).filter(
        cast(ClimateData.date, Date) == target.date(),
        col_filter.isnot(None),
        ClimateData.lat.isnot(None),
        ClimateData.lon.isnot(None),
    ).all()

    return _to_geojson(rows, value_col)
