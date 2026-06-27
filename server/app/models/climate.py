from sqlalchemy import Column, String, Float, DateTime, UniqueConstraint
from datetime import datetime, timezone
import uuid
from app.database.db import Base, engine

config = engine.url if hasattr(engine, 'url') else None
db_url = str(config) if config else ""
is_postgres = db_url.startswith("postgresql")

if is_postgres:
    try:
        from geoalchemy2 import Geometry
        has_postgis = True
    except ImportError:
        has_postgis = False
else:
    has_postgis = False


class ClimateData(Base):
    __tablename__ = "climate_data"

    __table_args__ = (
        UniqueConstraint("date", "lat", "lon", name="uq_climate_date_lat_lon"),
    )

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    region = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False, index=True, default="")
    district = Column(String, nullable=False, index=True, default="")
    date = Column(DateTime, nullable=False, index=True)

    rainfall = Column(Float)
    max_temp = Column(Float)
    min_temp = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    cloud_coverage = Column(Float)

    lat = Column(Float, index=True)
    lon = Column(Float, index=True)

    if has_postgis:
        geom = Column(Geometry("POINT", srid=4326), index=True)

    source = Column(String, default="imd")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
