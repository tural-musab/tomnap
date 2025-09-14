# 🐳 TomNAP Docker Guide

Complete Docker setup for TomNAP social e-commerce platform with production and development configurations.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Production Deployment](#production-deployment)
- [Development Environment](#development-environment)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Monitoring & Health](#monitoring--health)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ RAM available
- 10GB+ free disk space

### Production Deployment

```bash
# 1. Clone and setup
git clone https://github.com/tural-musab/tomnap.git
cd tomnap

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase and Sentry credentials

# 3. Build and run
pnpm docker:build
pnpm docker:up
```

Application will be available at http://localhost:3000

### Development Environment

```bash
# Start development environment with hot reloading
pnpm docker:up:dev

# Or with additional services (Postgres, Redis)
docker-compose -f docker-compose.dev.yml --profile dev up
```

## 🏗️ Architecture

### Multi-Stage Production Build

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Base Image    │───▶│   Dependencies  │───▶│     Builder     │───▶│     Runner      │
│  node:18-alpine │    │  Install deps   │    │  Build app      │    │  Final image    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Container Specifications

| Environment | Size   | Layers | Build Time | Security                     |
| ----------- | ------ | ------ | ---------- | ---------------------------- |
| Production  | ~180MB | 12     | ~3-5 min   | Non-root user, health checks |
| Development | ~450MB | 8      | ~2-3 min   | Debug ports, live reloading  |

## 🔧 Available Scripts

### Build Scripts

```bash
pnpm docker:build          # Build production image
pnpm docker:build:dev      # Build development image
pnpm docker:test           # Build and run tests
```

### Runtime Scripts

```bash
pnpm docker:up             # Start production containers
pnpm docker:up:dev         # Start development environment
pnpm docker:down           # Stop all containers
```

### Monitoring Scripts

```bash
pnpm docker:health         # Check container health
pnpm docker:logs           # View live logs
```

### Direct Docker Commands

```bash
# Production
docker-compose up -d                    # Background mode
docker-compose up --scale tomnap=3      # Scale to 3 instances

# Development
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml --profile dev up  # With DB
```

## ⚙️ Configuration

### Environment Variables

| Variable                        | Required | Description               | Default |
| ------------------------------- | -------- | ------------------------- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅       | Supabase project URL      | -       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅       | Supabase anonymous key    | -       |
| `SUPABASE_SERVICE_ROLE_KEY`     | ✅       | Supabase service role key | -       |
| `NEXT_PUBLIC_SENTRY_DSN`        | ❌       | Sentry DSN for monitoring | -       |
| `SENTRY_AUTH_TOKEN`             | ❌       | Sentry auth token         | -       |

### Docker Configuration Files

```
├── Dockerfile              # Production image
├── Dockerfile.dev          # Development image
├── docker-compose.yml      # Production services
├── docker-compose.dev.yml  # Development services
├── .dockerignore           # Exclude patterns
└── scripts/
    ├── docker-build.sh     # Build automation
    └── docker-health.sh    # Health monitoring
```

### Network Configuration

- **Production**: `tomnap-network` (bridge)
- **Development**: `tomnap-dev-network` (bridge)

### Volume Mounts

```yaml
# Production
volumes:
  - ./uploads:/app/uploads          # File uploads

# Development
volumes:
  - .:/app                         # Source code
  - /app/node_modules              # Exclude node_modules
  - /app/.next                     # Exclude build cache
```

## 📊 Monitoring & Health

### Health Checks

All containers include comprehensive health monitoring:

```yaml
healthcheck:
  test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health']
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

### Monitoring Dashboard

```bash
# Real-time health monitoring
./scripts/docker-health.sh tomnap-tomnap-1 30 watch

# One-time health check
pnpm docker:health

# Live log streaming
pnpm docker:logs
```

### Metrics Collected

- **Container Status**: Running, health, restart count
- **Resource Usage**: CPU, memory, network I/O
- **Application Health**: Response time, error rates
- **Network Connectivity**: Port bindings, service discovery

## 🔐 Security Features

### Container Security

- ✅ **Non-root execution**: Containers run as `nextjs` user (UID 1001)
- ✅ **Read-only filesystem**: Application files are immutable
- ✅ **Health monitoring**: Automatic restart on failure
- ✅ **Resource limits**: Memory and CPU constraints
- ✅ **Network isolation**: Services communicate via named networks

### Build Security

- ✅ **Multi-stage builds**: Minimal production images
- ✅ **Dependency scanning**: Security vulnerabilities detected
- ✅ **Secret exclusion**: .env files excluded via .dockerignore
- ✅ **Layer optimization**: Reduced attack surface

## 🐞 Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs tomnap

# Common causes:
# - Missing environment variables
# - Port 3000 already in use
# - Insufficient memory
```

#### 2. Build Failures

```bash
# Clear Docker cache
docker system prune -a

# Rebuild with no cache
docker-compose build --no-cache

# Check disk space
df -h
```

#### 3. Performance Issues

```bash
# Check resource usage
docker stats

# Monitor health metrics
./scripts/docker-health.sh tomnap-tomnap-1 30 watch

# Scale horizontally
docker-compose up --scale tomnap=2
```

#### 4. Database Connection Issues (Dev)

```bash
# Restart with fresh database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml --profile dev up
```

### Debug Mode

```bash
# Development with debug port exposed
docker-compose -f docker-compose.dev.yml up

# Connect debugger to localhost:9229
```

### Performance Optimization

```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Use multi-platform builds
docker buildx build --platform linux/amd64,linux/arm64 .

# Optimize layers
docker build --target builder .  # Build only to builder stage
```

## 📈 Production Deployment

### Recommended Production Setup

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  tomnap:
    image: tomnap:latest
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
    restart: unless-stopped
```

### Load Balancing

```bash
# Scale application
docker-compose up --scale tomnap=3

# With nginx reverse proxy
docker-compose -f docker-compose.yml -f docker-compose.nginx.yml up
```

### Environment Separation

```bash
# Staging environment
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up

# Production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Container Security Best Practices](https://snyk.io/blog/10-docker-image-security-best-practices/)

---

**Need help?** Check our [troubleshooting guide](#troubleshooting) or create an issue on GitHub.
