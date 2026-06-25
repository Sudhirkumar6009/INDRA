# Contributing to INDRA

Thank you for your interest in contributing to INDRA Climate Intelligence Platform!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/indra.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+ with PostGIS
- Redis 7+

### Local Setup

```bash
# Client
cd client
npm install
cp .env.example .env.local
npm run dev

# Server
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# AI Engine
cd ai-engine
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Code Standards

### TypeScript/JavaScript
- Use TypeScript strict mode
- Follow ESLint rules
- Use functional components with hooks
- Write meaningful variable names

### Python
- Follow PEP 8
- Use type hints
- Write docstrings for functions
- Keep functions focused and small

### Git Commits
Use conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

Example: `feat: add rainfall prediction API endpoint`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update README.md with details of changes
5. Request review from maintainers

## Code Review Guidelines

- Be respectful and constructive
- Focus on code quality and maintainability
- Check for security vulnerabilities
- Verify performance implications

## Reporting Issues

When reporting bugs, include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, versions)
- Screenshots if applicable

## Feature Requests

- Check existing issues first
- Provide clear use case
- Explain expected benefits
- Consider implementation complexity

## Questions?

Open an issue with the `question` label or reach out to maintainers.

---

**Thank you for contributing to India's Climate Intelligence!**
