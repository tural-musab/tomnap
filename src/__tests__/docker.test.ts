import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Docker Configuration', () => {
  const projectRoot = process.cwd()

  describe('Dockerfile Configuration', () => {
    it('should have production Dockerfile', () => {
      const dockerfilePath = path.join(projectRoot, 'Dockerfile')
      expect(fs.existsSync(dockerfilePath)).toBe(true)

      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8')
      expect(dockerfileContent).toContain('FROM node:18-alpine')
      expect(dockerfileContent).toContain('WORKDIR /app')
      expect(dockerfileContent).toContain('EXPOSE 3000')
      expect(dockerfileContent).toContain('USER nextjs')
      expect(dockerfileContent).toContain('HEALTHCHECK')
    })

    it('should have development Dockerfile', () => {
      const dockerfileDevPath = path.join(projectRoot, 'Dockerfile.dev')
      expect(fs.existsSync(dockerfileDevPath)).toBe(true)

      const dockerfileContent = fs.readFileSync(dockerfileDevPath, 'utf8')
      expect(dockerfileContent).toContain('FROM node:18-alpine')
      expect(dockerfileContent).toContain('ENV NODE_ENV=development')
      expect(dockerfileContent).toContain('EXPOSE 3000')
      expect(dockerfileContent).toContain('EXPOSE 9229') // Debug port
    })

    it('should have .dockerignore file', () => {
      const dockerignorePath = path.join(projectRoot, '.dockerignore')
      expect(fs.existsSync(dockerignorePath)).toBe(true)

      const dockerignoreContent = fs.readFileSync(dockerignorePath, 'utf8')
      expect(dockerignoreContent).toContain('node_modules')
      expect(dockerignoreContent).toContain('.env*.local')
      expect(dockerignoreContent).toContain('.next/')
      expect(dockerignoreContent).toContain('.git')
    })
  })

  describe('Docker Compose Configuration', () => {
    it('should have production docker-compose.yml', () => {
      const composePath = path.join(projectRoot, 'docker-compose.yml')
      expect(fs.existsSync(composePath)).toBe(true)

      const composeContent = fs.readFileSync(composePath, 'utf8')
      expect(composeContent).toContain('version:')
      expect(composeContent).toContain('services:')
      expect(composeContent).toContain('tomnap:')
      expect(composeContent).toContain('ports:')
      expect(composeContent).toContain('environment:')
      expect(composeContent).toContain('healthcheck:')
    })

    it('should have development docker-compose.dev.yml', () => {
      const composeDevPath = path.join(projectRoot, 'docker-compose.dev.yml')
      expect(fs.existsSync(composeDevPath)).toBe(true)

      const composeContent = fs.readFileSync(composeDevPath, 'utf8')
      expect(composeContent).toContain('tomnap-dev:')
      expect(composeContent).toContain('postgres-dev:')
      expect(composeContent).toContain('redis-dev:')
      expect(composeContent).toContain('volumes:')
    })

    it('should configure proper environment variables', () => {
      const composePath = path.join(projectRoot, 'docker-compose.yml')
      const composeContent = fs.readFileSync(composePath, 'utf8')

      const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'NEXT_PUBLIC_SENTRY_DSN',
      ]

      requiredEnvVars.forEach((envVar) => {
        expect(composeContent).toContain(envVar)
      })
    })

    it('should expose correct ports', () => {
      const composePath = path.join(projectRoot, 'docker-compose.yml')
      const composeContent = fs.readFileSync(composePath, 'utf8')

      expect(composeContent).toContain('"3000:3000"')
    })

    it('should configure networks', () => {
      const composePath = path.join(projectRoot, 'docker-compose.yml')
      const composeContent = fs.readFileSync(composePath, 'utf8')

      expect(composeContent).toContain('networks:')
      expect(composeContent).toContain('tomnap-network:')
      expect(composeContent).toContain('driver: bridge')
    })
  })

  describe('Docker Scripts', () => {
    it('should have docker build script', () => {
      const buildScriptPath = path.join(projectRoot, 'scripts/docker-build.sh')
      expect(fs.existsSync(buildScriptPath)).toBe(true)

      const scriptContent = fs.readFileSync(buildScriptPath, 'utf8')
      expect(scriptContent).toContain('#!/bin/bash')
      expect(scriptContent).toContain('docker build')
      expect(scriptContent).toContain('production')
      expect(scriptContent).toContain('development')
      expect(scriptContent).toContain('test')
    })

    it('should have docker health script', () => {
      const healthScriptPath = path.join(projectRoot, 'scripts/docker-health.sh')
      expect(fs.existsSync(healthScriptPath)).toBe(true)

      const scriptContent = fs.readFileSync(healthScriptPath, 'utf8')
      expect(scriptContent).toContain('#!/bin/bash')
      expect(scriptContent).toContain('check_container_status')
      expect(scriptContent).toContain('check_app_health')
      expect(scriptContent).toContain('check_resource_usage')
    })

    it('should have executable permissions on scripts', () => {
      const buildScriptPath = path.join(projectRoot, 'scripts/docker-build.sh')
      const healthScriptPath = path.join(projectRoot, 'scripts/docker-health.sh')

      if (fs.existsSync(buildScriptPath)) {
        const buildStats = fs.statSync(buildScriptPath)
        expect(buildStats.mode & parseInt('111', 8)).toBeGreaterThan(0)
      }

      if (fs.existsSync(healthScriptPath)) {
        const healthStats = fs.statSync(healthScriptPath)
        expect(healthStats.mode & parseInt('111', 8)).toBeGreaterThan(0)
      }
    })
  })

  describe('Next.js Docker Configuration', () => {
    it('should have standalone output configured', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.ts')
      expect(fs.existsSync(nextConfigPath)).toBe(true)

      const configContent = fs.readFileSync(nextConfigPath, 'utf8')
      expect(configContent).toContain("output: 'standalone'")
    })
  })

  describe('Security Configuration', () => {
    it('should run containers as non-root user', () => {
      const dockerfilePath = path.join(projectRoot, 'Dockerfile')
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8')

      expect(dockerfileContent).toContain('addgroup --system')
      expect(dockerfileContent).toContain('adduser --system')
      expect(dockerfileContent).toContain('USER nextjs')
    })

    it('should have health checks configured', () => {
      const dockerfilePath = path.join(projectRoot, 'Dockerfile')
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8')

      expect(dockerfileContent).toContain('HEALTHCHECK')
      expect(dockerfileContent).toContain('/api/health')
      expect(dockerfileContent).toContain('--interval')
      expect(dockerfileContent).toContain('--timeout')
      expect(dockerfileContent).toContain('--retries')
    })

    it('should exclude sensitive files in .dockerignore', () => {
      const dockerignorePath = path.join(projectRoot, '.dockerignore')
      const dockerignoreContent = fs.readFileSync(dockerignorePath, 'utf8')

      const sensitivePatterns = [
        '.env*.local',
        '.env',
        'node_modules',
        '.git',
        '*.log',
        '.vscode',
        '.idea',
      ]

      sensitivePatterns.forEach((pattern) => {
        expect(dockerignoreContent).toContain(pattern)
      })
    })
  })

  describe('Multi-stage Build Optimization', () => {
    it('should use multi-stage build for production', () => {
      const dockerfilePath = path.join(projectRoot, 'Dockerfile')
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8')

      expect(dockerfileContent).toContain('FROM node:18-alpine AS base')
      expect(dockerfileContent).toContain('FROM base AS deps')
      expect(dockerfileContent).toContain('FROM base AS builder')
      expect(dockerfileContent).toContain('FROM base AS runner')
    })

    it('should optimize image layers', () => {
      const dockerfilePath = path.join(projectRoot, 'Dockerfile')
      const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8')

      expect(dockerfileContent).toContain('COPY package.json pnpm-lock.yaml*')
      expect(dockerfileContent).toContain('--frozen-lockfile')
      expect(dockerfileContent).toContain('COPY --from=builder')
    })
  })

  describe('Development Environment', () => {
    it('should support development database', () => {
      const composeDevPath = path.join(projectRoot, 'docker-compose.dev.yml')
      const composeContent = fs.readFileSync(composeDevPath, 'utf8')

      expect(composeContent).toContain('postgres-dev:')
      expect(composeContent).toContain('POSTGRES_DB: tomnap_dev')
      expect(composeContent).toContain('5433:5432')
    })

    it('should support development redis', () => {
      const composeDevPath = path.join(projectRoot, 'docker-compose.dev.yml')
      const composeContent = fs.readFileSync(composeDevPath, 'utf8')

      expect(composeContent).toContain('redis-dev:')
      expect(composeContent).toContain('6380:6379')
    })

    it('should support hot reloading in development', () => {
      const composeDevPath = path.join(projectRoot, 'docker-compose.dev.yml')
      const composeContent = fs.readFileSync(composeDevPath, 'utf8')

      expect(composeContent).toContain('volumes:')
      expect(composeContent).toContain('.:/app')
      expect(composeContent).toContain('WATCHPACK_POLLING=true')
    })
  })
})
