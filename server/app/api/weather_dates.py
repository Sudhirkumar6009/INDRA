"""
weather_dates.py
Helper endpoint to discover which dates have data for a given year/month.

The frontend uses this to populate the day picker — only showing days
that actually have data in the database.
"""

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, distinct, cast, Date
from datetime import datetime
from app.database.db import get_db
from app.models.climate import ClimateData

router = APIRouter(prefix="/weather", tags=["Weather Dates"])


@router.get("/dates")
def get_available_dates(
    year: int = Query(..., description="Year (e.g. 2025)"),
    month: int = Query(..., ge=1, le=12, description="Month (1–12)"),
    variable: str = Query(
        default="rainfall",
        description="rainfall, max_temp, or min_temp — only returns dates that have this variable",
    ),
    db: Session = Depends(get_db),
):
    """
    Return a sorted list of dates (YYYY-MM-DD strings) that have data
    for the given year, month, and variable.

    Example response:
        {"dates": ["2025-06-01", "2025-06-02", ..., "2025-06-28"], "count": 28}
    """
    col_map = {
        "rainfall": ClimateData.rainfall,
        "max_temp": ClimateData.max_temp,
        "min_temp": ClimateData.min_temp,
    }
    value_col = col_map.get(variable)
    if not value_col:
        raise HTTPException(status_code=400, detail=f"variable must be one of: {list(col_map.keys())}")

    # Query distinct dates for this year/month that have the requested variable
    date_col = cast(ClimateData.date, Date)

    rows = db.query(
        distinct(date_col).label("d"),
    ).filter(
        extract("year", ClimateData.date) == year,
        extract("month", ClimateData.date) == month,
        value_col.isnot(None),
    ).order_by("d").all()

    dates = [r.d.isoformat() if hasattr(r.d, "isoformat") else str(r.d) for r in rows]

    return {
        "dates": dates,
        "count": len(dates),
        "year": year,
        "month": month,
        "variable": variable,
    }
