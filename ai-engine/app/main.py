from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
from datetime import datetime

app = FastAPI(
    title="INDRA AI Engine",
    description="AI/ML prediction and simulation engine for climate intelligence",
    version="1.0.0"
)

class PredictionRequest(BaseModel):
    region: str
    state: str
    district: str
    date: str

class PredictionResponse(BaseModel):
    id: str
    region: str
    date: str
    predicted_rainfall: float
    predicted_max_temp: float
    predicted_min_temp: float
    confidence: float
    model_accuracy: float
    factors: List[str]

class SimulationRequest(BaseModel):
    region: str
    temp_change: float
    rainfall_change: float = 0

class SimulationResponse(BaseModel):
    id: str
    region: str
    scenario: str
    temp_change: float
    rainfall_change: float
    drought_probability: float
    flood_risk: float
    timestamp: str

@app.get("/")
def read_root():
    return {
        "name": "INDRA AI Engine",
        "version": "1.0.0",
        "status": "operational"
    }

@app.post("/api/v1/predict", response_model=PredictionResponse)
async def predict_climate(request: PredictionRequest):
    predicted_rainfall = np.random.uniform(10, 150)
    predicted_max_temp = np.random.uniform(25, 42)
    predicted_min_temp = np.random.uniform(15, 28)
    confidence = np.random.uniform(0.75, 0.95)
    
    return PredictionResponse(
        id=f"pred_{datetime.now().timestamp()}",
        region=request.region,
        date=request.date,
        predicted_rainfall=round(predicted_rainfall, 2),
        predicted_max_temp=round(predicted_max_temp, 2),
        predicted_min_temp=round(predicted_min_temp, 2),
        confidence=round(confidence, 2),
        model_accuracy=0.89,
        factors=["Sea Surface Temperature", "Historical Patterns", "Humidity Levels"]
    )

@app.post("/api/v1/simulate", response_model=SimulationResponse)
async def simulate_scenario(request: SimulationRequest):
    drought_prob = 0.0
    flood_risk = 0.0
    
    if request.temp_change > 2:
        drought_prob = min(0.8, request.temp_change * 0.15)
    
    if request.rainfall_change > 50:
        flood_risk = min(0.9, request.rainfall_change * 0.01)
    
    return SimulationResponse(
        id=f"sim_{datetime.now().timestamp()}",
        region=request.region,
        scenario=f"+{request.temp_change}°C temperature change",
        temp_change=request.temp_change,
        rainfall_change=request.rainfall_change,
        drought_probability=round(drought_prob, 2),
        flood_risk=round(flood_risk, 2),
        timestamp=datetime.now().isoformat()
    )

@app.get("/api/v1/insights")
async def get_insights(region: str):
    return {
        "region": region,
        "insights": [
            "Rainfall likely to decrease by 18% in the next quarter",
            "Extreme heat events expected to increase",
            "Crop irrigation requirements will increase by 25%",
            "Flood probability remains low for this season"
        ],
        "risk_score": 72,
        "confidence": 0.85
    }
