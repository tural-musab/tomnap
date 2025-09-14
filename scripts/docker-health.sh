#!/bin/bash

# Docker health monitoring script for TomNAP
# Monitors container health, logs, and performance metrics

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME=${1:-tomnap-tomnap-1}
CHECK_INTERVAL=${2:-30}

echo -e "${BLUE}🏥 TomNAP Docker Health Monitor${NC}"
echo -e "${BLUE}Container: ${CONTAINER_NAME}${NC}"
echo -e "${BLUE}Check interval: ${CHECK_INTERVAL}s${NC}\n"

# Function to check container status
check_container_status() {
    if docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}" | grep -q "${CONTAINER_NAME}"; then
        STATUS=$(docker ps --filter "name=${CONTAINER_NAME}" --format "{{.Status}}" | head -1)
        echo -e "${GREEN}✅ Container Status: ${STATUS}${NC}"
        return 0
    else
        echo -e "${RED}❌ Container not found or not running${NC}"
        return 1
    fi
}

# Function to check application health
check_app_health() {
    HEALTH_URL="http://localhost:3000/api/health"
    
    if curl -f -s "${HEALTH_URL}" > /dev/null 2>&1; then
        RESPONSE=$(curl -s "${HEALTH_URL}")
        echo -e "${GREEN}✅ Application Health: OK${NC}"
        echo -e "${BLUE}   Response: ${RESPONSE}${NC}"
        return 0
    else
        echo -e "${RED}❌ Application Health: FAILED${NC}"
        return 1
    fi
}

# Function to show resource usage
check_resource_usage() {
    if docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep -q "${CONTAINER_NAME}"; then
        STATS=$(docker stats --no-stream --format "{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" "${CONTAINER_NAME}")
        CPU=$(echo "$STATS" | cut -f1)
        MEM_USAGE=$(echo "$STATS" | cut -f2)
        MEM_PERC=$(echo "$STATS" | cut -f3)
        
        echo -e "${BLUE}📊 Resource Usage:${NC}"
        echo -e "   CPU: ${CPU}"
        echo -e "   Memory: ${MEM_USAGE} (${MEM_PERC})"
        
        # Alert on high usage
        CPU_NUM=$(echo "$CPU" | sed 's/%//')
        MEM_NUM=$(echo "$MEM_PERC" | sed 's/%//')
        
        if (( $(echo "$CPU_NUM > 80" | bc -l) )); then
            echo -e "${YELLOW}⚠️  High CPU usage detected${NC}"
        fi
        
        if (( $(echo "$MEM_NUM > 80" | bc -l) )); then
            echo -e "${YELLOW}⚠️  High memory usage detected${NC}"
        fi
    fi
}

# Function to check recent logs
check_logs() {
    echo -e "${BLUE}📋 Recent Logs (last 20 lines):${NC}"
    docker logs --tail 20 "${CONTAINER_NAME}" 2>&1 | while read line; do
        if echo "$line" | grep -q -i "error"; then
            echo -e "${RED}   $line${NC}"
        elif echo "$line" | grep -q -i "warn"; then
            echo -e "${YELLOW}   $line${NC}"
        else
            echo -e "   $line"
        fi
    done
}

# Function to check network connectivity
check_network() {
    echo -e "${BLUE}🌐 Network Check:${NC}"
    
    # Check if container is connected to network
    if docker inspect "${CONTAINER_NAME}" --format '{{range .NetworkSettings.Networks}}{{.NetworkID}}{{end}}' | grep -q .; then
        echo -e "${GREEN}   ✅ Container connected to network${NC}"
    else
        echo -e "${RED}   ❌ Container network issues${NC}"
    fi
    
    # Check port binding
    if docker port "${CONTAINER_NAME}" | grep -q "3000"; then
        PORT_INFO=$(docker port "${CONTAINER_NAME}" 3000)
        echo -e "${GREEN}   ✅ Port 3000 mapped: ${PORT_INFO}${NC}"
    else
        echo -e "${RED}   ❌ Port 3000 not mapped${NC}"
    fi
}

# Function to perform full health check
perform_health_check() {
    echo -e "${BLUE}=================== Health Check Report ===================${NC}"
    echo -e "Timestamp: $(date)"
    echo ""
    
    check_container_status
    echo ""
    
    if check_container_status > /dev/null 2>&1; then
        check_app_health
        echo ""
        
        check_resource_usage
        echo ""
        
        check_network
        echo ""
        
        check_logs
    fi
    
    echo -e "${BLUE}=========================================================${NC}\n"
}

# Main execution
case "${3:-once}" in
    "watch")
        echo -e "${BLUE}🔄 Starting continuous monitoring...${NC}"
        echo -e "${BLUE}Press Ctrl+C to stop${NC}\n"
        
        while true; do
            perform_health_check
            sleep $CHECK_INTERVAL
        done
        ;;
        
    "once"|"")
        perform_health_check
        ;;
        
    "logs")
        echo -e "${BLUE}📋 Live Logs (Press Ctrl+C to stop):${NC}"
        docker logs -f "${CONTAINER_NAME}"
        ;;
        
    *)
        echo -e "${RED}❌ Invalid mode. Use: once, watch, or logs${NC}"
        exit 1
        ;;
esac