from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database.db import get_db
from app.models.climate import ClimateData
from app.schemas.climate import ClimateDataResponse
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/climate", tags=["Climate Data"])

@router.get("/data", response_model=List[ClimateDataResponse])
def get_climate_data(
    state: Optional[str] = None,
    district: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
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
    
    return query.limit(limit).all()

@router.get("/historical")
def get_historical_data(
    region: str,
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
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
    current_user = Depends(get_current_user)
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
    current_user = Depends(get_current_user)
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
