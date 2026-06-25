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

# INDRA Climate Intelligence Platform

**Integrated National Digital Replica of Atmosphere**

INDRA is an AI-powered digital twin of India's climate system designed for monitoring, analysis, forecasting, and scenario planning across national geospatial and meteorological datasets.

## Official Scope

The platform is built to support Indian climate intelligence workflows using sources such as IMD, INSAT, MOSDAC, Bhuvan, and future NICES integration. It combines interactive geospatial visualization, predictive analytics, historical exploration, and decision support in a production-ready full-stack architecture.

## Technology Stack

### Client

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zustand
- React Query
- Axios
- Leaflet or MapLibre GL JS
- Plotly and Recharts
- Responsive layouts
- Dark and light mode support
- Professional ISRO-inspired blue-white theme

### Server

- Python
- FastAPI
- Pydantic
- SQLAlchemy
- PostgreSQL with PostGIS
- Redis
- JWT authentication
- Docker
- REST APIs
- OpenAPI documentation
- Background jobs for preprocessing and ingestion

## Core Modules

The platform should provide complete frontend and backend support for:

- Landing page
- Authentication
- Dashboard
- Interactive India climate map
- Rainfall visualization
- Temperature visualization
- Satellite layer viewer
- Climate timeline
- AI prediction
- Historical explorer
- Climate comparison
- District search
- State search
- What-if simulation
- AI-generated climate insights
- Climate risk scoring
- Extreme weather alerts
- Dataset explorer
- Analytics dashboard
- Report generation
- User profile
- Admin dashboard
- API documentation

## Backend APIs

The backend should expose clean REST endpoints for:

- Authentication
- Dashboard
- Predictions
- Simulations
- Historical climate
- Analytics
- Reports
- Alerts
- Datasets
- User management

All APIs should include validation, pagination, filtering, logging, caching, and consistent error handling.

## Quality Requirements

- Modular architecture
- Feature-based folder structure
- Strong TypeScript typing
- Reusable UI components
- Responsive layouts
- Accessibility
- Optimized performance
- Clean API contracts
- Environment configuration
- Docker support
- Unit and integration tests
- Production-ready code standards

## Repository Layout

This workspace is organized to support a full-stack implementation across separate layers:

- `client/` for the web application
- `server/` for API services
- `ai-engine/` for model-serving and prediction workflows
- `data-pipeline/` for ingestion, preprocessing, and dataset preparation

## Product Intent

This repository should be treated as a national-scale climate intelligence system, not a demo shell. Every screen, component, route, API, state flow, and integration should be implemented with production expectations so the platform can be demonstrated to domain experts and scaled over time.

## Notes For Contributors

- Keep the public architecture clear and consistent.
- Prefer reusable patterns over one-off implementations.
- Preserve strong typing and explicit contracts between client and server.
- Favor maintainable abstractions that can evolve with new datasets and analytics needs.
  │ │ │ ├── ui/ # Base UI components
  │ │ │ ├── dashboard/ # Dashboard widgets
  │ │ │ ├── maps/ # Map components
  │ │ │ ├── charts/ # Chart components
  │ │ │ └── common/ # Shared components
  │ │ ├── hooks/ # Custom React hooks
  │ │ ├── services/ # API services
  │ │ ├── store/ # Zustand stores
  │ │ ├── types/ # TypeScript types
  │ │ ├── utils/ # Utility functions
  │ │ └── styles/ # Global styles
  │ └── package.json
  │
  ├── server/ # FastAPI backend
  │ ├── app/
  │ │ ├── api/ # API routes
  │ │ ├── models/ # SQLAlchemy models
  │ │ ├── schemas/ # Pydantic schemas
  │ │ ├── services/ # Business logic
  │ │ ├── database/ # DB connection
  │ │ ├── middleware/ # Auth middleware
  │ │ ├── auth/ # Authentication
  │ │ └── utils/ # Utilities
  │ └── requirements.txt
  │
  ├── ai-engine/ # AI/ML service
  │ ├── app/
  │ │ ├── models/ # ML models
  │ │ ├── inference/ # Prediction logic
  │ │ └── utils/ # Processing utils
  │ └── requirements.txt
  │
  └── data-pipeline/ # ETL pipeline
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
#   I N D R A 
 
 
```
