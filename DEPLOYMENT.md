# INDRA Deployment Guide

Complete guide for deploying INDRA Climate Intelligence Platform to production.

## Deployment Options

1. **Docker Compose** (Recommended for single-server)
2. **Kubernetes** (For scalable cloud deployment)
3. **Manual** (Traditional deployment)

---

## Option 1: Docker Compose Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 20GB disk space

### Steps

1. **Clone repository:**
```bash
git clone <repo-url>
cd indra
```

2. **Configure environment:**
```bash
# Copy and edit environment files
cp client/.env.example client/.env.local
cp server/.env.example server/.env
cp ai-engine/.env.example ai-engine/.env

# Edit with production values
```

3. **Start services:**
```bash
docker-compose up -d
```

4. **Verify deployment:**
```bash
# Check all containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

5. **Access services:**
- Frontend: http://your-domain.com
- API: http://your-domain.com:8000
- AI Engine: http://your-domain.com:8001

---

## Option 2: Cloud Deployment

### Vercel (Frontend)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy client:**
```bash
cd client
vercel --prod
```

3. **Set environment variables in Vercel dashboard:**
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_AI_ENGINE_URL

### Render (Backend)

1. **Create Web Service for Server:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Create Web Service for AI Engine:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Create PostgreSQL Database:**
   - Choose PostgreSQL 14+
   - Enable PostGIS extension

4. **Create Redis Instance:**
   - Select Redis service

5. **Configure environment variables**

### AWS Deployment

#### Frontend (S3 + CloudFront)
```bash
cd client
npm run build
aws s3 sync out/ s3://your-bucket-name
```

#### Backend (EC2 or ECS)
```bash
# EC2 deployment
ssh ubuntu@your-ec2-instance
git clone <repo-url>
cd indra/server
# Follow manual deployment steps
```

#### Database (RDS)
- Create PostgreSQL RDS instance
- Enable PostGIS extension
- Update DATABASE_URL in server .env

---

## Option 3: Manual Deployment

### Server Requirements
- Ubuntu 20.04+ / CentOS 8+
- 4GB RAM minimum
- 20GB disk space
- Domain name with SSL

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.10
sudo apt install -y python3.10 python3.10-venv python3-pip

# Install PostgreSQL 14
sudo apt install -y postgresql postgresql-contrib postgis

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx
```

### 2. Setup PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE indra;
CREATE USER indra_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE indra TO indra_user;
\c indra
CREATE EXTENSION postgis;
\q
```

### 3. Deploy Server

```bash
cd /opt
sudo git clone <repo-url> indra
sudo chown -R $USER:$USER indra
cd indra/server

python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://indra_user:your-password@localhost:5432/indra
REDIS_URL=redis://localhost:6379
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
AI_ENGINE_URL=http://localhost:8001
CORS_ORIGINS=https://your-domain.com
EOF
```

### 4. Deploy AI Engine

```bash
cd /opt/indra/ai-engine

python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file if needed
```

### 5. Setup Systemd Services

**Server Service:**
```bash
sudo nano /etc/systemd/system/indra-server.service
```

```ini
[Unit]
Description=INDRA Server
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/indra/server
Environment="PATH=/opt/indra/server/venv/bin"
ExecStart=/opt/indra/server/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

**AI Engine Service:**
```bash
sudo nano /etc/systemd/system/indra-ai.service
```

```ini
[Unit]
Description=INDRA AI Engine
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/indra/ai-engine
Environment="PATH=/opt/indra/ai-engine/venv/bin"
ExecStart=/opt/indra/ai-engine/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

**Enable and start services:**
```bash
sudo systemctl enable indra-server indra-ai
sudo systemctl start indra-server indra-ai
sudo systemctl status indra-server indra-ai
```

### 6. Deploy Client

```bash
cd /opt/indra/client
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_AI_ENGINE_URL=https://ai.your-domain.com
EOF

npm run build
```

**Client Service:**
```bash
sudo nano /etc/systemd/system/indra-client.service
```

```ini
[Unit]
Description=INDRA Client
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/indra/client
Environment="PATH=/usr/bin:/usr/local/bin"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable indra-client
sudo systemctl start indra-client
```

### 7. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/indra
```

```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# API Server
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# AI Engine
server {
    listen 80;
    server_name ai.your-domain.com;

    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/indra /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d api.your-domain.com -d ai.your-domain.com
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Set strong SECRET_KEY
- [ ] Enable firewall (UFW)
- [ ] Configure HTTPS/SSL
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure environment variables
- [ ] Enable database encryption
- [ ] Set up monitoring and logging

---

## Monitoring

### Logs

```bash
# Server logs
sudo journalctl -u indra-server -f

# AI Engine logs
sudo journalctl -u indra-ai -f

# Client logs
sudo journalctl -u indra-client -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Checks

```bash
# Server health
curl http://localhost:8000/health

# AI Engine health
curl http://localhost:8001/

# Database
psql -U indra_user -d indra -c "SELECT version();"

# Redis
redis-cli ping
```

---

## Backup & Recovery

### Database Backup

```bash
# Backup
pg_dump -U indra_user indra > indra_backup_$(date +%Y%m%d).sql

# Restore
psql -U indra_user indra < indra_backup_20240101.sql
```

### Automated Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /usr/bin/pg_dump -U indra_user indra > /backups/indra_$(date +\%Y\%m\%d).sql
```

---

## Troubleshooting

### Service won't start
```bash
sudo journalctl -u indra-server -n 50
```

### Port already in use
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

### Database connection failed
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in .env
- Check firewall rules

---

## Performance Optimization

1. **Enable Nginx caching**
2. **Configure PostgreSQL for production**
3. **Set up Redis caching**
4. **Enable gzip compression**
5. **Configure CDN for static assets**

---

**Need help?** Open an issue on GitHub or contact the maintainers.
