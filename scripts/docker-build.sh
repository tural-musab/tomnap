#!/bin/bash

# Docker build script for TomNAP
# Usage: ./scripts/docker-build.sh [production|development|test]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-production}

echo -e "${BLUE}🐳 Building TomNAP Docker image for ${ENVIRONMENT}...${NC}"

# Check if .env file exists
if [[ ! -f .env.local && "$ENVIRONMENT" == "development" ]]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local not found. Create it from .env.example if needed.${NC}"
fi

# Build based on environment
case $ENVIRONMENT in
    "production")
        echo -e "${BLUE}Building production image...${NC}"
        
        # Build production image
        docker build -t tomnap:latest -t tomnap:production .
        
        # Verify image was built
        if docker images | grep -q "tomnap.*latest"; then
            echo -e "${GREEN}✅ Production image built successfully!${NC}"
            
            # Show image size
            IMAGE_SIZE=$(docker images tomnap:latest --format "table {{.Size}}" | tail -n 1)
            echo -e "${BLUE}📏 Image size: ${IMAGE_SIZE}${NC}"
        else
            echo -e "${RED}❌ Failed to build production image${NC}"
            exit 1
        fi
        ;;
        
    "development")
        echo -e "${BLUE}Building development image...${NC}"
        
        # Build development image
        docker build -f Dockerfile.dev -t tomnap:dev -t tomnap:development .
        
        # Verify image was built
        if docker images | grep -q "tomnap.*dev"; then
            echo -e "${GREEN}✅ Development image built successfully!${NC}"
            
            # Show image size
            IMAGE_SIZE=$(docker images tomnap:dev --format "table {{.Size}}" | tail -n 1)
            echo -e "${BLUE}📏 Image size: ${IMAGE_SIZE}${NC}"
        else
            echo -e "${RED}❌ Failed to build development image${NC}"
            exit 1
        fi
        ;;
        
    "test")
        echo -e "${BLUE}Building test image...${NC}"
        
        # Build test image with different target
        docker build --target builder -t tomnap:test .
        
        # Run tests in container
        echo -e "${BLUE}🧪 Running tests in container...${NC}"
        docker run --rm tomnap:test sh -c "pnpm test && pnpm run typecheck && pnpm run lint"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ All tests passed!${NC}"
        else
            echo -e "${RED}❌ Tests failed${NC}"
            exit 1
        fi
        ;;
        
    *)
        echo -e "${RED}❌ Invalid environment. Use: production, development, or test${NC}"
        exit 1
        ;;
esac

# Show available images
echo -e "\n${BLUE}📋 Available TomNAP images:${NC}"
docker images | grep tomnap

# Security scan (if trivy is available)
if command -v trivy &> /dev/null; then
    echo -e "\n${BLUE}🔍 Running security scan...${NC}"
    trivy image tomnap:latest || echo -e "${YELLOW}⚠️  Security scan completed with warnings${NC}"
fi

echo -e "\n${GREEN}🎉 Docker build completed successfully!${NC}"

# Usage instructions
echo -e "\n${BLUE}💡 Usage:${NC}"
echo -e "  Production: ${GREEN}docker-compose up${NC}"
echo -e "  Development: ${GREEN}docker-compose -f docker-compose.dev.yml up${NC}"
echo -e "  Single container: ${GREEN}docker run -p 3000:3000 tomnap:latest${NC}"