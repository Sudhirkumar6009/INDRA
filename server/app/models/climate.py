from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
import uuid
from app.database.db import Base

class ClimateData(Base):
    __tablename__ = "climate_data"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    region = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    date = Column(DateTime, nullable=False, index=True)
    
    rainfall = Column(Float)
    max_temp = Column(Float)
    min_temp = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    cloud_coverage = Column(Float)
    
    lat = Column(Float)
    lon = Column(Float)
    
    source = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
