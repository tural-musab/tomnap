# 🔧 GitHub Workflows & CI/CD

This directory contains all GitHub Actions workflows and repository configuration for TomNAP.

## 📋 Workflows Overview

### 1. CI/CD Pipeline (`ci.yml`)
**Trigger**: Push to `main`/`develop`, Pull Requests to `main`

**Jobs**:
- **Quality Checks**: ESLint, TypeScript, Tests
- **Build**: Application build with artifacts
- **Security**: Vulnerability scanning with Trivy
- **Deploy Staging**: Auto-deploy to staging on `develop` branch
- **Deploy Production**: Auto-deploy to production on `main` branch
- **Notifications**: Discord/Slack notifications

**Features**:
- ✅ Parallel job execution for speed
- 🧪 Comprehensive testing with coverage
- 🔒 Security scanning
- 📦 Build artifact management
- 🚀 Automated deployments
- 📱 Mobile and accessibility testing

### 2. Quality Gate (`quality-gate.yml`)
**Trigger**: Pull Requests

**Jobs**:
- **Code Quality**: ESLint, SonarCloud analysis
- **Performance Budget**: Bundle size, Lighthouse CI
- **Accessibility**: WCAG compliance checks

**Features**:
- 📊 Automated PR comments with results
- 🎯 Performance budget enforcement
- ♿ Accessibility compliance
- 📈 Code quality metrics

### 3. Dependency Updates (`dependency-update.yml`)
**Trigger**: Weekly schedule (Mondays 9 AM UTC)

**Jobs**:
- **Update Dependencies**: Latest package versions
- **Security Audit**: Vulnerability checks
- **Automated PRs**: Weekly dependency update PRs

**Features**:
- 🔄 Automated dependency management
- 🔒 Security vulnerability fixes
- 📋 Automated PR creation
- 🧪 Post-update testing

### 4. Database Operations (`database.yml`)
**Trigger**: Migration file changes, manual dispatch

**Jobs**:
- **Migration**: Auto-apply database migrations
- **Backup**: Database backups with retention
- **Seeding**: Development data seeding

**Features**:
- 🗄️ Automated migration deployment
- 💾 Regular database backups
- 🌱 Development environment seeding
- ✅ Migration verification

## 🔐 Required Secrets

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key
- `SUPABASE_ACCESS_TOKEN`: CLI access token
- `DATABASE_URL`: Direct database connection

### Authentication
- `NEXTAUTH_SECRET`: NextAuth secret key
- `NEXTAUTH_URL`: Application URL

### Deployment
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

### Monitoring & Analytics
- `SENTRY_DSN`: Sentry error tracking DSN
- `SENTRY_ORG`: Sentry organization
- `SENTRY_PROJECT`: Sentry project name
- `SONAR_TOKEN`: SonarCloud token

### Notifications (Optional)
- `DISCORD_WEBHOOK`: Discord webhook URL
- `SLACK_WEBHOOK`: Slack webhook URL

### Code Quality
- `LHCI_GITHUB_APP_TOKEN`: Lighthouse CI token
- `CODECOV_TOKEN`: Codecov upload token

## 🏷️ Branch Strategy

### Main Branches
- **`main`**: Production-ready code, auto-deploys to production
- **`develop`**: Integration branch, auto-deploys to staging

### Feature Branches
- **`feature/*`**: New features
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes
- **`chore/*`**: Maintenance tasks

### Workflow
1. Create feature branch from `develop`
2. Develop and test locally
3. Create PR to `develop`
4. Quality gates run automatically
5. Code review and approval
6. Merge to `develop` (staging deployment)
7. Create PR from `develop` to `main`
8. Production deployment after merge

## 📊 Quality Standards

### Code Quality
- **ESLint**: No errors allowed
- **TypeScript**: Strict mode compliance
- **Test Coverage**: Minimum 80%
- **Bundle Size**: < 500KB initial load

### Performance
- **Lighthouse Performance**: > 80
- **First Contentful Paint**: < 2.5s
- **Largest Contentful Paint**: < 4s
- **Cumulative Layout Shift**: < 0.1

### Accessibility
- **WCAG 2.1 AA**: Full compliance
- **Lighthouse Accessibility**: > 90
- **Screen Reader**: Compatible
- **Keyboard Navigation**: Full support

### Security
- **No High/Critical vulnerabilities**
- **OWASP compliance**
- **Security headers**: Implemented
- **Dependency scanning**: Automated

## 🚀 Deployment Process

### Staging
- **Trigger**: Push to `develop` branch
- **Environment**: `staging`
- **URL**: Generated Vercel preview URL
- **Database**: Staging database

### Production
- **Trigger**: Push to `main` branch
- **Environment**: `production`
- **URL**: `https://tomnap.com`
- **Database**: Production database
- **Release**: Auto-tagged GitHub release

## 🔍 Monitoring & Alerting

### Health Checks
- **Endpoint**: `/api/health`
- **Metrics**: Database, memory, response time
- **Monitoring**: Uptime checks

### Error Tracking
- **Sentry**: Real-time error monitoring
- **Alerts**: Critical errors notify team
- **Performance**: Track performance regressions

### Performance Monitoring
- **Lighthouse CI**: Continuous performance monitoring
- **Bundle Analysis**: Track bundle size changes
- **Web Vitals**: Core Web Vitals tracking

## 📋 Issue & PR Templates

### Bug Report Template
- Structured bug reporting
- Environment details
- Reproduction steps
- Expected vs actual behavior

### Feature Request Template
- Problem statement
- Proposed solution
- Acceptance criteria
- Technical requirements

### PR Template
- Change description
- Testing checklist
- Security considerations
- Breaking changes

## 🔄 Maintenance

### Weekly
- Dependency updates (automated)
- Security audit (automated)
- Performance review

### Monthly
- Database backup verification
- Workflow optimization review
- Security assessment

### Quarterly
- Full security audit
- Performance optimization
- Workflow efficiency review

## 🛠️ Local Development

### Setup
```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local

# Run development server
pnpm dev

# Run tests
pnpm test

# Run quality checks
pnpm lint
pnpm typecheck
```

### Pre-commit Hooks
- ESLint fixes
- Prettier formatting
- Type checking
- Test validation

## 📞 Support

For questions about workflows or CI/CD:
- Create an issue with the `infrastructure` label
- Contact: @tural-musab
- Documentation: This file

---
*Last updated: $(date)*