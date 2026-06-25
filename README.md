# INDRA - Climate Intelligence Platform

**Integrated National Digital Replica of Atmosphere**

AI-Powered Digital Twin of India's Climate for Monitoring, Prediction & Scenario Intelligence

## 🌍 Overview

INDRA is a comprehensive climate intelligence platform that creates a digital twin of India's atmosphere, enabling real-time monitoring, AI-powered predictions, and what-if scenario simulations using national datasets from IMD, INSAT, MOSDAC, and Bhuvan.

## 🏗️ Architecture

The platform follows a microservices architecture with four independent services:

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐       ┌──────────────┐
│   Client    │ ←───→ │    Server    │ ←───→ │  AI Engine  │ ←───→ │Data Pipeline │
│  (Next.js)  │       │  (FastAPI)   │       │  (FastAPI)  │       │   (Python)   │
└─────────────┘       └──────────────┘       └─────────────┘       └──────────────┘
      ↓                      ↓                        ↓                      ↓
   Browser            PostgreSQL +             AI Models              IMD/INSAT
                         Redis                                          Data
```

## 🚀 Features

### Core Functionalities

1. **Live Climate Dashboard**
   - Interactive India map with multiple layers
   - Rainfall, temperature, humidity visualization
   - Satellite imagery overlay
   - Real-time data updates

2. **Climate Timeline**
   - Historical data from 2010-2025
   - Slider-based navigation
   - Comparative analysis

3. **Digital Twin View**
   - Current vs Predicted state comparison
   - Side-by-side visualization
   - AI-powered future projections

4. **AI Prediction Module**
   - Regional climate forecasting
   - Confidence scoring
   - Multi-factor analysis

5. **What-if Simulations**
   - Temperature change scenarios
   - Rainfall impact analysis
   - Drought/flood probability
   - Real-time simulation engine

6. **Climate Comparison**
   - Multi-region comparison
   - Trend analysis
   - Anomaly detection

7. **Historical Explorer**
   - State/district-level data
   - Year-wise analysis
   - Satellite snapshots

8. **AI Insights**
   - Natural language explanations
   - Risk scoring
   - Actionable recommendations

9. **Extreme Weather Detection**
   - Automated alerts
   - Severity classification
   - Real-time notifications

10. **Climate Risk Score**
    - District-level assessment
    - Multi-factor evaluation
    - Prediction integration

## 📦 Tech Stack

### Client
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** React Query
- **Maps:** Leaflet / React-Leaflet
- **Charts:** Recharts, Plotly.js
- **Animations:** Framer Motion

### Server
- **Framework:** FastAPI
- **Database:** PostgreSQL + PostGIS
- **Cache:** Redis
- **ORM:** SQLAlchemy
- **Authentication:** JWT
- **Validation:** Pydantic

### AI Engine
- **Framework:** FastAPI
- **ML Libraries:** TensorFlow, PyTorch, scikit-learn
- **Models:** LSTM, Transformer, ConvLSTM
- **Processing:** NumPy, Pandas

### Data Pipeline
- **ETL:** Python
- **Sources:** IMD, INSAT, MOSDAC, Bhuvan
- **Processing:** Pandas, NumPy
- **Storage:** PostgreSQL

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Redis 7+

### 1. Clone Repository

```bash
git clone <repository-url>
cd indra
```

### 2. Client Setup

```bash
cd client
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

Client runs on `http://localhost:3000`

### 3. Server Setup

```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database configuration
uvicorn app.main:app --reload --port 8000
```

Server runs on `http://localhost:8000`

### 4. AI Engine Setup

```bash
cd ai-engine
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

AI Engine runs on `http://localhost:8001`

### 5. Database Setup

```bash
# Create PostgreSQL database
createdb indra

# Install PostGIS extension
psql indra -c "CREATE EXTENSION postgis;"

# Run migrations (if using Alembic)
cd server
alembic upgrade head
```

## 📁 Project Structure

```
indra/
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js pages
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Base UI components
│   │   │   ├── dashboard/   # Dashboard widgets
│   │   │   ├── maps/        # Map components
│   │   │   ├── charts/      # Chart components
│   │   │   └── common/      # Shared components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # Global styles
│   └── package.json
│
├── server/                   # FastAPI backend
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   ├── database/        # DB connection
│   │   ├── middleware/      # Auth middleware
│   │   ├── auth/            # Authentication
│   │   └── utils/           # Utilities
│   └── requirements.txt
│
├── ai-engine/               # AI/ML service
│   ├── app/
│   │   ├── models/          # ML models
│   │   ├── inference/       # Prediction logic
│   │   └── utils/           # Processing utils
│   └── requirements.txt
│
└── data-pipeline/           # ETL pipeline
    ├── ingestion/
    ├── processing/
    └── storage/
```

## 🔐 Environment Variables

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:8001
```

### Server (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/indra
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
AI_ENGINE_URL=http://localhost:8001
CORS_ORIGINS=http://localhost:3000
```

## 🧪 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📊 Data Sources

- **IMD (India Meteorological Department)**: Rainfall, temperature, weather data
- **INSAT (Indian National Satellite)**: Satellite imagery, cloud coverage
- **MOSDAC**: Oceanographic and meteorological data
- **Bhuvan (ISRO)**: Geospatial datasets

## 🎯 Roadmap

- [ ] Real LSTM model integration
- [ ] Live IMD data ingestion
- [ ] WebSocket real-time updates
- [ ] Mobile app (React Native)
- [ ] ML model retraining pipeline
- [ ] NICES dataset integration
- [ ] Advanced visualization layers
- [ ] Export to PDF/CSV reports

## 🤝 Contributing

This is a production-grade platform designed for national climate intelligence. Contributions should maintain high code quality and documentation standards.

## 📝 License

MIT License - Open for research and development

## 🙏 Acknowledgments

- ISRO for satellite data infrastructure
- IMD for meteorological datasets
- All contributors to climate data accessibility

---

**Built with ❤️ for India's Climate Intelligence**
#   I N D R A  
 