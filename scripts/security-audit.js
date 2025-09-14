#!/usr/bin/env node

/**
 * Security Audit Script for TomNAP
 * Performs automated security checks and generates a report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

class SecurityAuditor {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: []
    };
  }

  check(description, testFn) {
    try {
      const result = testFn();
      if (result === true) {
        log.success(description);
        this.results.passed++;
      } else if (result === 'warning') {
        log.warning(description);
        this.results.warnings++;
      } else {
        log.error(description);
        this.results.failed++;
        this.results.issues.push(description);
      }
    } catch (error) {
      log.error(`${description} - Error: ${error.message}`);
      this.results.failed++;
      this.results.issues.push(description);
    }
  }

  // Check if file exists and contains pattern
  checkFileContains(filePath, pattern, description) {
    if (!fs.existsSync(filePath)) {
      log.error(`${description} - File not found: ${filePath}`);
      this.results.failed++;
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const found = typeof pattern === 'string' ? content.includes(pattern) : pattern.test(content);
    
    if (found) {
      log.success(description);
      this.results.passed++;
      return true;
    } else {
      log.error(description);
      this.results.failed++;
      this.results.issues.push(description);
      return false;
    }
  }

  // Check environment variables
  checkEnvironmentSecurity() {
    log.section('🔐 Environment Security Checks');
    
    this.check('Environment file should not be in repository', () => {
      if (!fs.existsSync('.gitignore')) return false;
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      return gitignore.includes('.env');
    });

    this.check('Required environment variables are documented', () => {
      return fs.existsSync('.env.example') || fs.existsSync('README.md');
    });

    // Check for hardcoded secrets
    const sensitiveFiles = ['src', 'pages', 'components'].filter(dir => fs.existsSync(dir));
    
    for (const dir of sensitiveFiles) {
      this.checkDirectoryForSecrets(dir);
    }
  }

  checkDirectoryForSecrets(directory) {
    const sensitivePatterns = [
      /password\s*=\s*["'][^"']+["']/gi,
      /secret\s*=\s*["'][^"']+["']/gi,
      /api_key\s*=\s*["'][^"']+["']/gi,
      /private_key\s*=\s*["'][^"']+["']/gi,
      /token\s*=\s*["'][^"']+["']/gi
    ];

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          walkDir(filePath);
        } else if (stat.isFile() && /\.(js|ts|jsx|tsx)$/.test(file)) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          for (const pattern of sensitivePatterns) {
            if (pattern.test(content)) {
              log.warning(`Potential hardcoded secret in ${filePath}`);
              this.results.warnings++;
            }
          }
        }
      }
    };

    walkDir(directory);
  }

  // Check Next.js security configuration
  checkNextJSConfig() {
    log.section('⚙️ Next.js Security Configuration');
    
    this.checkFileContains(
      'next.config.ts',
      'poweredByHeader: false',
      'X-Powered-By header should be disabled'
    );

    // Check for security headers in config or security config file
    this.check('Content Security Policy should be configured', () => {
      const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
      const securityConfig = fs.existsSync('next-security.config.js') ? 
        fs.readFileSync('next-security.config.js', 'utf8') : '';
      return nextConfig.includes('Content-Security-Policy') || securityConfig.includes('Content-Security-Policy');
    });

    this.check('X-Frame-Options header should be set', () => {
      const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
      const securityConfig = fs.existsSync('next-security.config.js') ? 
        fs.readFileSync('next-security.config.js', 'utf8') : '';
      return nextConfig.includes('X-Frame-Options') || securityConfig.includes('X-Frame-Options');
    });

    this.check('X-Content-Type-Options header should be set', () => {
      const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
      const securityConfig = fs.existsSync('next-security.config.js') ? 
        fs.readFileSync('next-security.config.js', 'utf8') : '';
      return nextConfig.includes('X-Content-Type-Options') || securityConfig.includes('X-Content-Type-Options');
    });

    this.checkFileContains(
      'next.config.ts',
      'remotePatterns',
      'Image domains should be explicitly configured'
    );
  }

  // Check middleware security
  checkMiddleware() {
    log.section('🛡️ Middleware Security Checks');
    
    this.checkFileContains(
      'src/middleware.ts',
      'rate limiting',
      'Rate limiting should be implemented'
    );

    this.checkFileContains(
      'src/middleware.ts',
      'protectedRoutes',
      'Protected routes should be defined'
    );

    this.checkFileContains(
      'src/middleware.ts',
      'auth',
      'Authentication checks should be present'
    );

    this.checkFileContains(
      'src/middleware.ts',
      'Security',
      'Security headers should be configured'
    );
  }

  // Check dependencies for vulnerabilities
  checkDependencies() {
    log.section('📦 Dependency Security Checks');
    
    try {
      // Check if package-lock.json or pnpm-lock.yaml exists
      const hasLockFile = fs.existsSync('package-lock.json') || 
                         fs.existsSync('pnpm-lock.yaml') || 
                         fs.existsSync('yarn.lock');
      
      if (hasLockFile) {
        log.success('Lock file exists for dependency integrity');
        this.results.passed++;
      } else {
        log.error('No lock file found - dependencies are not pinned');
        this.results.failed++;
        this.results.issues.push('Missing dependency lock file');
      }

      // Try to run audit (if available)
      try {
        const auditCommand = fs.existsSync('pnpm-lock.yaml') ? 'pnpm audit' : 'npm audit';
        const auditResult = execSync(auditCommand, { encoding: 'utf8', stdio: 'pipe' });
        
        if (auditResult.includes('0 vulnerabilities')) {
          log.success('No known vulnerabilities in dependencies');
          this.results.passed++;
        } else {
          log.warning('Found vulnerabilities in dependencies - run audit for details');
          this.results.warnings++;
        }
      } catch (auditError) {
        if (auditError.status === 1) {
          log.warning('Vulnerabilities found in dependencies');
          this.results.warnings++;
        } else {
          log.info('Could not run dependency audit');
        }
      }

    } catch (error) {
      log.error(`Dependency check failed: ${error.message}`);
      this.results.failed++;
    }
  }

  // Check HTTPS and SSL configuration
  checkSSLConfig() {
    log.section('🔒 SSL/HTTPS Configuration');
    
    this.check('HSTS header should be configured', () => {
      const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
      const securityConfig = fs.existsSync('next-security.config.js') ? 
        fs.readFileSync('next-security.config.js', 'utf8') : '';
      return nextConfig.includes('Strict-Transport-Security') || securityConfig.includes('Strict-Transport-Security');
    });

    this.check('Secure cookie settings should be configured', () => {
      // Check if middleware or auth code sets secure cookies
      const middlewareExists = fs.existsSync('src/middleware.ts');
      if (middlewareExists) {
        const middleware = fs.readFileSync('src/middleware.ts', 'utf8');
        return middleware.includes('secure') || middleware.includes('sameSite');
      }
      return 'warning';
    });
  }

  // Check for common security misconfigurations
  checkCommonIssues() {
    log.section('🚨 Common Security Issues');
    
    this.check('Debug mode should be disabled in production', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const buildScript = packageJson.scripts?.build || '';
      return !buildScript.includes('--debug');
    });

    this.check('Source maps should be disabled in production', () => {
      const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
      return nextConfig.includes('hideSourceMaps') || !nextConfig.includes('productionBrowserSourceMaps: true');
    });

    this.check('Console.log removal should be configured', () => {
      const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
      return nextConfig.includes('removeConsole');
    });
  }

  // Generate security report
  generateReport() {
    log.section('📊 Security Audit Report');
    
    const total = this.results.passed + this.results.failed + this.results.warnings;
    const score = Math.round((this.results.passed / total) * 100);
    
    console.log(`\n${colors.bold}Security Score: ${score}%${colors.reset}`);
    console.log(`${colors.green}✓ Passed: ${this.results.passed}${colors.reset}`);
    console.log(`${colors.yellow}⚠ Warnings: ${this.results.warnings}${colors.reset}`);
    console.log(`${colors.red}✗ Failed: ${this.results.failed}${colors.reset}`);
    
    if (this.results.issues.length > 0) {
      console.log(`\n${colors.bold}${colors.red}Issues to address:${colors.reset}`);
      this.results.issues.forEach(issue => {
        console.log(`  • ${issue}`);
      });
    }

    if (score >= 90) {
      console.log(`\n${colors.green}🎉 Excellent security configuration!${colors.reset}`);
    } else if (score >= 80) {
      console.log(`\n${colors.yellow}👍 Good security configuration with room for improvement.${colors.reset}`);
    } else {
      console.log(`\n${colors.red}⚠️ Security configuration needs significant improvement.${colors.reset}`);
    }

    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      score,
      results: this.results,
      recommendations: this.getRecommendations()
    };

    fs.writeFileSync('security-audit-report.json', JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: security-audit-report.json`);
  }

  getRecommendations() {
    const recommendations = [];
    
    if (this.results.failed > 0) {
      recommendations.push('Address all failed security checks immediately');
    }
    
    if (this.results.warnings > 0) {
      recommendations.push('Review and resolve security warnings');
    }
    
    recommendations.push('Run security audits regularly in CI/CD pipeline');
    recommendations.push('Keep dependencies updated and monitor for vulnerabilities');
    recommendations.push('Implement automated security testing');
    
    return recommendations;
  }

  // Run all security checks
  audit() {
    console.log(`${colors.bold}🔍 TomNAP Security Audit${colors.reset}\n`);
    
    this.checkEnvironmentSecurity();
    this.checkNextJSConfig();
    this.checkMiddleware();
    this.checkDependencies();
    this.checkSSLConfig();
    this.checkCommonIssues();
    
    this.generateReport();
    
    // Exit with non-zero code if critical issues found
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.audit();
}

module.exports = SecurityAuditor;