from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, date
from app.database.db import get_db
from app.models.climate import ClimateData
from app.schemas.climate import ClimateDataResponse

router = APIRouter(prefix="/climate", tags=["Climate Data"])


@router.get("/data", response_model=List[ClimateDataResponse])
def get_climate_data(
    state: Optional[str] = None,
    district: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    min_lat: Optional[float] = None,
    max_lat: Optional[float] = None,
    min_lon: Optional[float] = None,
    max_lon: Optional[float] = None,
    variable: Optional[str] = None,
    limit: int = Query(500, le=5000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(ClimateData)

    if state:
        query = query.filter(ClimateData.state == state)
    if district:
        query = query.filter(ClimateData.district == district)
    if start_date:
        query = query.filter(ClimateData.date >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(ClimateData.date <= datetime.fromisoformat(end_date))
    if min_lat is not None:
        query = query.filter(ClimateData.lat >= min_lat)
    if max_lat is not None:
        query = query.filter(ClimateData.lat <= max_lat)
    if min_lon is not None:
        query = query.filter(ClimateData.lon >= min_lon)
    if max_lon is not None:
        query = query.filter(ClimateData.lon <= max_lon)

    if variable == "rainfall":
        query = query.filter(ClimateData.rainfall.isnot(None))
    elif variable == "max_temp":
        query = query.filter(ClimateData.max_temp.isnot(None))
    elif variable == "min_temp":
        query = query.filter(ClimateData.min_temp.isnot(None))

    return query.order_by(ClimateData.date.desc()).offset(offset).limit(limit).all()


@router.get("/monthly/{year}/{month}")
def get_monthly_data(
    year: int,
    month: int,
    variable: Optional[str] = None,
    db: Session = Depends(get_db),
):
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    query = db.query(
        ClimateData.lat,
        ClimateData.lon,
        func.avg(ClimateData.rainfall).label("rainfall"),
        func.avg(ClimateData.max_temp).label("max_temp"),
        func.avg(ClimateData.min_temp).label("min_temp"),
    ).filter(
        ClimateData.date >= date(year, month, 1),
        ClimateData.date < end_date,
    )

    if variable == "rainfall":
        query = query.filter(ClimateData.rainfall.isnot(None))
    elif variable == "max_temp":
        query = query.filter(ClimateData.max_temp.isnot(None))
    elif variable == "min_temp":
        query = query.filter(ClimateData.min_temp.isnot(None))

    results = query.group_by(ClimateData.lat, ClimateData.lon).all()

    return [
        {
            "lat": r.lat,
            "lon": r.lon,
            "rainfall": round(r.rainfall, 2) if r.rainfall is not None else None,
            "maxTemp": round(r.max_temp, 2) if r.max_temp is not None else None,
            "minTemp": round(r.min_temp, 2) if r.min_temp is not None else None,
        }
        for r in results
    ]


@router.get("/historical")
def get_historical_data(
    region: str,
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db),
):
    query = db.query(ClimateData).filter(
        ClimateData.region == region,
        ClimateData.date >= datetime.fromisoformat(start_date),
        ClimateData.date <= datetime.fromisoformat(end_date)
    )
    data = query.all()

    return {
        "region": region,
        "start_date": start_date,
        "end_date": end_date,
        "data_points": len(data),
        "data": [
            {
                "date": d.date.isoformat(),
                "rainfall": d.rainfall,
                "max_temp": d.max_temp,
                "min_temp": d.min_temp,
            }
            for d in data
        ]
    }


@router.get("/timeline/{year}")
def get_timeline(
    year: int,
    db: Session = Depends(get_db),
):
    start_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)

    query = db.query(ClimateData).filter(
        ClimateData.date >= start_date,
        ClimateData.date <= end_date
    )

    return {
        "year": year,
        "data": query.limit(500).all()
    }


@router.get("/search")
def search_region(
    q: str = Query(..., min_length=2),
    db: Session = Depends(get_db),
):
    results = db.query(ClimateData.region, ClimateData.state, ClimateData.district).filter(
        (ClimateData.region.ilike(f"%{q}%")) |
        (ClimateData.state.ilike(f"%{q}%")) |
        (ClimateData.district.ilike(f"%{q}%"))
    ).distinct().limit(10).all()

    return [
        {"region": r.region, "state": r.state, "district": r.district}
        for r in results
    ]


@router.get("/grid-points")
def get_grid_points(
    date: str = Query(...),
    db: Session = Depends(get_db),
):
    target_date = datetime.fromisoformat(date)

    points = db.query(ClimateData).filter(
        ClimateData.date == target_date
    ).all()

    return [
        {
            "lat": p.lat,
            "lon": p.lon,
            "rainfall": p.rainfall,
            "max_temp": p.max_temp,
            "min_temp": p.min_temp,
            "maxTemp": p.max_temp,
            "minTemp": p.min_temp,
        }
        for p in points
    ]
