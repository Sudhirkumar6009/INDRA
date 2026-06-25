from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class ClimateDataBase(BaseModel):
    region: str
    state: str
    district: str
    date: datetime
    rainfall: Optional[float] = None
    max_temp: Optional[float] = None
    min_temp: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None
    cloud_coverage: Optional[float] = None
    lat: float
    lon: float

class ClimateDataResponse(ClimateDataBase):
    id: UUID
    source: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PredictionRequest(BaseModel):
    region: str
    state: str
    district: str
    date: str

class PredictionResponse(BaseModel):
    id: UUID
    region: str
    date: str
    predicted_rainfall: float
    predicted_max_temp: float
    predicted_min_temp: float
    confidence: float
    model_accuracy: float
    factors: list[str]

class SimulationRequest(BaseModel):
    region: str
    temp_change: float
    rainfall_change: Optional[float] = 0

class SimulationResponse(BaseModel):
    id: UUID
    region: str
    scenario: str
    temp_change: float
    rainfall_change: float
    drought_probability: float
    flood_risk: float
    timestamp: datetime
