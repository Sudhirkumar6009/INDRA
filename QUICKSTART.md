# 🚀 INDRA Platform - Quick Start Guide

## Single Command Setup & Launch

### Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Python** (v3.9 or higher) - [Download](https://www.python.org/)
3. **Git** - [Download](https://git-scm.com/)

### Installation & Launch

#### Step 1: Install All Dependencies

```bash
npm run install:all
```

This command will:
- Install root dependencies
- Install client (Next.js) dependencies
- Install server (FastAPI) dependencies

#### Step 2: Start Both Client & Server

```bash
npm run dev
```

OR

```bash
npm start
```

This single command starts:
- **Client**: http://localhost:3000 (Next.js frontend)
- **Server**: http://localhost:8000 (FastAPI backend)

### 🎉 That's It!

Open your browser and visit:
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## What Runs Automatically

### Client (Port 3000)
- Next.js development server
- Hot reload enabled
- Dark mode support
- Google OAuth ready

### Server (Port 8000)
- FastAPI with auto-reload
- SQLite database (auto-created)
- CORS enabled for localhost:3000
- API documentation at /docs

---

## Environment Configuration

### Client (.env.local)
Already configured with defaults:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Server (.env)
Already configured with defaults:
```env
DATABASE_URL=sqlite:///./indra.db
SECRET_KEY=dev-secret-key
```

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client & server |
| `npm start` | Alias for `npm run dev` |
| `npm run dev:client` | Start only client |
| `npm run dev:server` | Start only server |
| `npm run install:all` | Install all dependencies |

---

## Troubleshooting

### Port Already in Use

**Client (3000)**:
```bash
# Kill process on Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in client/package.json
"dev": "next dev -p 3001"
```

**Server (8000)**:
```bash
# Kill process on Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Python Not Found

Make sure Python is in PATH:
```bash
python --version
# Should show Python 3.9+
```

If not, install Python and check "Add to PATH" during installation.

### Module Not Found

Reinstall dependencies:
```bash
npm run install:all
```

---

## Database

### Default Setup
- Uses SQLite (no PostgreSQL needed)
- Database file: `server/indra.db`
- Auto-created on first run
- No migration commands needed

### Switching to PostgreSQL (Optional)

1. Install PostgreSQL
2. Update `server/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/indra
```

---

## Testing the Platform

### 1. Frontend Features
- ✅ Dark mode toggle (top-right)
- ✅ Landing page with animations
- ✅ Dashboard with climate stats
- ✅ Interactive map with layers
- ✅ Climate data viewer
- ✅ Authentication (email/password + Google)

### 2. Backend API
Visit http://localhost:8000/docs to test:
- ✅ Health check endpoint
- ✅ Authentication endpoints
- ✅ Climate data endpoints
- ✅ Dashboard endpoints

### 3. Quick Test Flow

1. Go to http://localhost:3000
2. Click "Launch Dashboard" or "Get Started"
3. Navigate through modules:
   - Dashboard
   - Interactive Map
   - Climate Data
4. Toggle dark mode (top-right)
5. Try authentication at /auth

---

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:3000/auth/callback`
4. Update `client/.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-actual-client-id
```

---

## Production Deployment

### Build Commands
```bash
npm run build
```

This builds both client and server for production.

### Environment Variables

Update production values:
- `SECRET_KEY` - Use strong random key
- `DATABASE_URL` - Production database
- `CORS_ORIGINS` - Your domain
- `GOOGLE_CLIENT_ID` - Production OAuth credentials

---

## Project Structure

```
indra/
├── client/              # Next.js frontend
│   ├── src/
│   │   ├── app/         # Pages & routes
│   │   ├── components/  # React components
│   │   ├── store/       # Zustand state
│   │   └── styles/      # Global styles
│   └── .env.local       # Client config
├── server/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── main.py      # FastAPI app
│   ├── .env             # Server config
│   └── indra.db         # SQLite database
└── package.json         # Root commands
```

---

## Features Implemented

### ✅ Frontend
- [x] Landing page
- [x] Authentication (Email + Google OAuth)
- [x] Dashboard with stats
- [x] Interactive climate map
- [x] Climate data viewer
- [x] User profile
- [x] Dark mode with animated toggle
- [x] Responsive design
- [x] Animations with Framer Motion

### ✅ Backend
- [x] User authentication (JWT)
- [x] Climate data endpoints
- [x] Dashboard statistics
- [x] Database models (SQLite/PostgreSQL)
- [x] CORS configuration
- [x] Auto-reload development

---

## Support

For issues:
1. Check this guide
2. Verify all prerequisites installed
3. Run `npm run install:all`
4. Check console logs for errors

---

## Next Steps

1. **Add Real Data**: Import climate data into database
2. **Configure OAuth**: Set up Google credentials
3. **Customize**: Modify theme, add features
4. **Deploy**: Build and deploy to production

---

**Built with ❤️ for India's Climate Intelligence**

Visit http://localhost:3000 to get started!
