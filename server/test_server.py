"""
Test script to verify INDRA server configuration
"""
import sys
import os

print("=" * 60)
print("INDRA Server Configuration Test")
print("=" * 60)

# Test imports
print("\n1. Testing imports...")
try:
    from app.config import settings
    print("   OK Config imported successfully")
except Exception as e:
    print(f"   ERROR Config import failed: {e}")
    sys.exit(1)

try:
    from app.database.db import Base, engine
    print("   OK Database imports successful")
except Exception as e:
    print(f"   ERROR Database import failed: {e}")
    sys.exit(1)

try:
    from app.models.user import User
    from app.models.climate import ClimateData
    print("   OK Models imported successfully")
except Exception as e:
    print(f"   ERROR Models import failed: {e}")
    sys.exit(1)

try:
    from app.api import auth, climate, dashboard
    print("   OK API routes imported successfully")
except Exception as e:
    print(f"   ERROR API routes import failed: {e}")
    sys.exit(1)

# Test configuration
print("\n2. Checking configuration...")
print(f"   Database URL: {settings.DATABASE_URL}")
print(f"   CORS Origins: {settings.cors_origins_list}")
print(f"   Secret Key: {'*' * 20} (hidden)")

# Test database
print("\n3. Testing database connection...")
try:
    Base.metadata.create_all(bind=engine)
    print("   OK Database tables created successfully")
    
    # Check if database file exists (for SQLite)
    if settings.DATABASE_URL.startswith("sqlite"):
        db_file = settings.DATABASE_URL.replace("sqlite:///./", "")
        if os.path.exists(db_file):
            print(f"   OK Database file exists: {db_file}")
        else:
            print(f"   ! Database file will be created: {db_file}")
except Exception as e:
    print(f"   ERROR Database connection failed: {e}")
    sys.exit(1)

print("\n4. Testing FastAPI app...")
try:
    from app.main import app
    print("   OK FastAPI app created successfully")
    print(f"   OK App title: {app.title}")
    print(f"   OK App version: {app.version}")
except Exception as e:
    print(f"   ERROR FastAPI app creation failed: {e}")
    sys.exit(1)

print("\n" + "=" * 60)
print("SUCCESS - All tests passed! Server is ready to run.")
print("=" * 60)
print("\nStart the server with:")
print("  python -m uvicorn app.main:app --reload --port 8000")
print("\nOr from root directory:")
print("  npm run dev")
print("=" * 60)
