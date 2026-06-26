#!/usr/bin/env python3
import os
from datetime import datetime

# Set database credentials for INDRA (URL-encode special chars)
os.environ["DATABASE_URL"] = "postgresql://postgres:Sudhir%409099@localhost:5432/indra"
os.environ["REDIS_URL"] = "redis://localhost:6379"
os.environ["AI_ENGINE_URL"] = "http://localhost:8001"
os.environ["SECRET_KEY"] = "change-this-in-production"

# Import app DB after env vars are set
from app.database.db import engine, SessionLocal, Base
from app.models.user import User
from app.models.climate import ClimateData

# Create tables
Base.metadata.create_all(bind=engine)

# Seed initial data if absent
db = SessionLocal()
try:
    if not db.query(User).filter_by(email="admin@indra.local").first():
        admin = User(
            email="admin@indra.local",
            name="INDRA Admin",
            hashed_password="pbkdf2:fake-hash-for-dev",
            role="admin"
        )
        db.add(admin)

    if not db.query(ClimateData).first():
        sample = ClimateData(
            region="North India",
            state="Delhi",
            district="New Delhi",
            date=datetime.utcnow(),
            rainfall=12.3,
            max_temp=36.5,
            min_temp=24.1,
            humidity=70.2,
            wind_speed=3.5,
            cloud_coverage=50.0,
            lat=28.6139,
            lon=77.2090,
            source="seed"
        )
        db.add(sample)

    db.commit()
finally:
    db.close()


if __name__ == "__main__":
    # Start the FastAPI app with uvicorn
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
