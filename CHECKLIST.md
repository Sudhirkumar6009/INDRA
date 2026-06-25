# INDRA - Build & Push Checklist

## ✅ Pre-Push Verification

Use this checklist before pushing to GitHub.

### 1. Build Verification

#### Client Build
```bash
cd client
npm install
npm run build
```
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] No ESLint warnings

#### Server Setup
```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
- [ ] All dependencies installed
- [ ] No import errors
- [ ] Can run: `uvicorn app.main:app`

#### AI Engine Setup
```bash
cd ai-engine
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
- [ ] All dependencies installed
- [ ] Can run: `uvicorn app.main:app --port 8001`

### 2. File Structure Check

```
indra/
├── .github/
│   ├── workflows/ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── client/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── Dockerfile
├── server/
│   ├── app/
│   ├── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   └── Dockerfile
├── ai-engine/
│   ├── app/
│   ├── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   └── Dockerfile
├── .gitignore
├── README.md
├── QUICKSTART.md
├── DEPLOYMENT.md
├── CONTRIBUTING.md
├── DOCUMENTATION.md
├── LICENSE
└── docker-compose.yml
```

- [ ] All directories exist
- [ ] All key files present
- [ ] .gitignore in all necessary locations

### 3. Environment Files

- [ ] `.env.example` exists in client/
- [ ] `.env.example` exists in server/
- [ ] `.env.example` exists in ai-engine/
- [ ] No actual `.env` files in repo
- [ ] No secrets/credentials committed

### 4. Documentation Check

- [ ] README.md is complete
- [ ] QUICKSTART.md is clear
- [ ] DEPLOYMENT.md is detailed
- [ ] All links work
- [ ] Code examples are correct

### 5. GitHub Configuration

- [ ] .gitignore is comprehensive
- [ ] LICENSE file exists
- [ ] CONTRIBUTING.md exists
- [ ] Issue templates exist
- [ ] PR template exists
- [ ] CI/CD workflow exists

### 6. Code Quality

- [ ] No console.log in production code
- [ ] No TODO comments without issues
- [ ] No hardcoded credentials
- [ ] No commented-out code blocks
- [ ] TypeScript strict mode enabled
- [ ] Python type hints used

### 7. Security Check

- [ ] No .env files committed
- [ ] No API keys in code
- [ ] No database credentials
- [ ] No private keys
- [ ] SECRET_KEY uses example value
- [ ] Passwords are hashed

### 8. Git Status

```bash
git status
```

Should show:
- [ ] No sensitive files
- [ ] Only intended files
- [ ] Clean working directory

### 9. Before First Push

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: INDRA Climate Intelligence Platform"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/indra.git

# Push
git push -u origin main
```

### 10. After Push Verification

Visit your GitHub repo and check:
- [ ] All files uploaded correctly
- [ ] README displays properly
- [ ] No .env files visible
- [ ] Issue templates work
- [ ] CI/CD pipeline runs
- [ ] Repository is public/private as intended

## 🐛 Common Issues Fixed

### ✅ Build Error - tailwindcss-animate
**Fixed**: Removed from Tailwind config, using vanilla CSS animations

### ✅ Next.js Version Warning
**Fixed**: Updated to Next.js 14.2.18 (stable)

### ✅ Missing Dependencies
**Fixed**: All dependencies added to package.json

### ✅ CSS Variable Issues
**Fixed**: Simplified to direct Tailwind classes

### ✅ Gitignore Incomplete
**Fixed**: Comprehensive .gitignore for all services

## 🚀 Ready to Push?

If all checkboxes above are ✅, you're ready to push to GitHub!

```bash
# Final verification
npm run build  # in client/
git status
git push
```

## 📞 Need Help?

- Review [QUICKSTART.md](QUICKSTART.md) for setup issues
- Check [DOCUMENTATION.md](DOCUMENTATION.md) for architecture
- Open an issue if problems persist

---

**Happy coding! 🎉**
