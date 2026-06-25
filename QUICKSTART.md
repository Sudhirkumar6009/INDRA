# INDRA Quick Start Guide

Get INDRA running on your local machine in under 10 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check Python (need 3.10+)
python --version

# Check PostgreSQL (need 14+)
psql --version

# Check Redis (need 7+)
redis-cli --version
```

## Step-by-Step Setup

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd indra

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Setup Database

```bash
# Create database
createdb indra

# Enable PostGIS
psql indra -c "CREATE EXTENSION postgis;"
```

### 3. Setup Environment Variables

```bash
# Client
cd client
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL if needed

# Server
cd ../server
cp .env.example .env
# Edit DATABASE_URL with your credentials

# AI Engine
cd ../ai-engine
cp .env.example .env
```

### 4. Start Services

**Terminal 1 - Server:**
```bash
cd server
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Server runs on: http://localhost:8000

**Terminal 2 - AI Engine:**
```bash
cd ai-engine
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```
AI Engine runs on: http://localhost:8001

**Terminal 3 - Client:**
```bash
cd client
npm run dev
```
Client runs on: http://localhost:3000

### 5. Verify Setup

Open your browser:
- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:8000/docs
- **AI Engine:** http://localhost:8001/docs

## Docker Setup (Alternative)

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down
```

## Common Issues

### Port Already in Use
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database 'indra' exists

### Module Not Found (Python)
```bash
# Make sure virtual environment is activated
pip install -r requirements.txt
```

### Module Not Found (Node)
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

## What's Next?

1. Create a user account at http://localhost:3000
2. Explore the API documentation at http://localhost:8000/docs
3. Check out the main README.md for detailed architecture
4. Start contributing! See CONTRIBUTING.md

## Need Help?

- Check the [main README](../README.md)
- Open an issue on GitHub
- Review existing issues and discussions

---

Happy coding! 🚀
