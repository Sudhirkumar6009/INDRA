# INDRA Documentation Index

Complete guide to all documentation resources for the INDRA Climate Intelligence Platform.

## 📚 Quick Links

- [Main README](README.md) - Project overview and architecture
- [Quick Start Guide](QUICKSTART.md) - Get running in 10 minutes
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute
- [License](LICENSE) - MIT License

## 🏗️ Architecture Documentation

### System Design
- **Microservices Architecture**: Client, Server, AI Engine, Data Pipeline
- **Tech Stack**: Next.js, FastAPI, PostgreSQL, Redis
- **Data Flow**: IMD/INSAT → Processing → Storage → API → Frontend

### Component Breakdown

#### Client (Next.js + TypeScript)
- Location: `/client`
- Port: 3000
- Documentation: [Client README](client/README.md) *(to be created)*

#### Server (FastAPI + Python)
- Location: `/server`
- Port: 8000
- API Docs: http://localhost:8000/docs (when running)

#### AI Engine (FastAPI + ML)
- Location: `/ai-engine`
- Port: 8001
- API Docs: http://localhost:8001/docs (when running)

#### Data Pipeline (Python)
- Location: `/data-pipeline`
- Scheduled ETL jobs

## 🚀 Getting Started

### For Developers
1. Read [QUICKSTART.md](QUICKSTART.md)
2. Set up local environment
3. Read [CONTRIBUTING.md](CONTRIBUTING.md)
4. Pick an issue to work on

### For DevOps
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Choose deployment strategy
3. Configure infrastructure
4. Set up monitoring

### For Researchers
1. Explore API documentation at `/docs`
2. Review data models in `/server/app/models`
3. Check AI implementations in `/ai-engine`

## 📖 API Documentation

### REST APIs

**Authentication**
- POST `/api/v1/auth/register` - Create new user
- POST `/api/v1/auth/login` - User login
- GET `/api/v1/auth/me` - Get current user

**Climate Data**
- GET `/api/v1/climate/data` - Query climate data
- GET `/api/v1/climate/historical` - Historical data
- GET `/api/v1/climate/timeline/{year}` - Year timeline
- GET `/api/v1/climate/search` - Search regions

**Dashboard**
- GET `/api/v1/dashboard` - Dashboard statistics

**Predictions (AI Engine)**
- POST `/api/v1/predict` - Generate prediction
- GET `/api/v1/insights` - Get AI insights

**Simulations (AI Engine)**
- POST `/api/v1/simulate` - Run what-if simulation

## 🗂️ Project Structure

```
indra/
├── .github/              # GitHub workflows and templates
│   ├── workflows/       # CI/CD pipelines
│   └── ISSUE_TEMPLATE/ # Issue templates
├── client/              # Next.js frontend
│   ├── src/
│   │   ├── app/        # Next.js pages
│   │   ├── components/ # React components
│   │   ├── services/   # API clients
│   │   ├── store/      # State management
│   │   └── types/      # TypeScript types
│   └── package.json
├── server/              # FastAPI backend
│   ├── app/
│   │   ├── api/        # Route handlers
│   │   ├── models/     # Database models
│   │   ├── schemas/    # Pydantic schemas
│   │   └── auth/       # Authentication
│   └── requirements.txt
├── ai-engine/           # ML/AI service
│   ├── app/
│   │   ├── models/     # ML models
│   │   └── inference/  # Prediction logic
│   └── requirements.txt
├── data-pipeline/       # ETL pipeline
│   ├── ingestion/
│   ├── processing/
│   └── storage/
└── docker-compose.yml   # Container orchestration
```

## 🔧 Development Guides

### Code Style
- **TypeScript**: ESLint + Prettier
- **Python**: Black + Flake8 + mypy
- **Commits**: Conventional Commits

### Testing
- **Frontend**: Jest + React Testing Library
- **Backend**: Pytest
- **E2E**: Playwright (coming soon)

### Branching Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

## 📊 Data Sources

### Integrated Datasets
- **IMD** (India Meteorological Department)
  - Rainfall data
  - Temperature records
  - Weather observations

- **INSAT** (Indian National Satellite)
  - Satellite imagery
  - Cloud coverage
  - Land/Sea surface temperature

- **MOSDAC** (Meteorological & Oceanographic Data)
  - Ocean data
  - Atmospheric data
  - Climate indicators

- **Bhuvan** (ISRO Geoportal)
  - Geospatial datasets
  - Land use data
  - Administrative boundaries

### Data Update Frequency
- Real-time: Satellite imagery
- Daily: Weather observations
- Monthly: Climate aggregates
- Yearly: Historical analysis

## 🎯 Feature Roadmap

### Phase 1 (Current)
- [x] Core platform architecture
- [x] Authentication system
- [x] Basic data visualization
- [x] API endpoints
- [ ] Real ML model integration
- [ ] Live data ingestion

### Phase 2 (Q2 2024)
- [ ] Advanced analytics
- [ ] Mobile application
- [ ] Real-time alerts
- [ ] Report generation
- [ ] Multi-language support

### Phase 3 (Q3 2024)
- [ ] NICES integration
- [ ] Advanced simulations
- [ ] Public API platform
- [ ] Data marketplace
- [ ] AI model marketplace

## 🤝 Community

### Ways to Contribute
- Report bugs via GitHub Issues
- Suggest features
- Improve documentation
- Submit pull requests
- Help others in discussions

### Communication Channels
- GitHub Issues - Bug reports & features
- GitHub Discussions - Q&A and ideas
- Pull Requests - Code contributions

## 📈 Performance Metrics

### Target Benchmarks
- API Response Time: < 200ms
- Page Load Time: < 2s
- Database Query Time: < 100ms
- Prediction Generation: < 5s
- Simulation Runtime: < 10s

## 🔐 Security

### Security Measures
- JWT authentication
- Password hashing (bcrypt)
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- HTTPS/SSL required in production

### Reporting Security Issues
Email security concerns to: security@indra-platform.org

## 📝 License

INDRA is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **ISRO** for satellite infrastructure
- **IMD** for meteorological data
- **Open source community** for amazing tools
- **Contributors** for making this possible

---

**Built with ❤️ for India's Climate Intelligence**

Last Updated: 2024
Version: 1.0.0
