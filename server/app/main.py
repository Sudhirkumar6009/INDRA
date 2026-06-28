from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, climate, dashboard, weather_geojson, weather_raster, weather_dates
from app.database.db import Base, engine, init_postgis

init_postgis()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="INDRA Climate Intelligence API",
    description="Backend API for INDRA Climate Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    # Allow all origins for the standalone weather map HTML (file:// or different port)
    # In production, restrict to settings.cors_origins_list
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(climate.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(weather_geojson.router, prefix="/api/v1")
app.include_router(weather_raster.router, prefix="/api/v1")
app.include_router(weather_dates.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {
        "name": "INDRA Climate Intelligence API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
