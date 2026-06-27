from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database.db import get_db
from app.models.climate import ClimateData

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
def get_dashboard(
    db: Session = Depends(get_db),
):
    total_data_points = db.query(func.count(ClimateData.id)).scalar()

    states_count = db.query(func.count(func.distinct(ClimateData.state))).scalar()

    recent_date = db.query(func.max(ClimateData.date)).scalar()

    avg_rainfall = db.query(func.avg(ClimateData.rainfall)).filter(
        ClimateData.date >= datetime.now() - timedelta(days=30)
    ).scalar()

    avg_temp = db.query(func.avg(ClimateData.max_temp)).filter(
        ClimateData.date >= datetime.now() - timedelta(days=30)
    ).scalar()

    return {
        "total_data_points": total_data_points or 0,
        "states_coverage": states_count or 0,
        "last_updated": recent_date.isoformat() if recent_date else None,
        "avg_rainfall_30d": round(avg_rainfall, 2) if avg_rainfall else 0,
        "avg_temp_30d": round(avg_temp, 2) if avg_temp else 0,
        "status": "operational"
    }
