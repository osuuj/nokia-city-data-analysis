#!/bin/bash

# Security Audit Script for Client Application
# Run this script periodically to check for security issues

set -e
echo "🔒 Running comprehensive security audit..."

# Create a directory for reports
REPORT_DIR="security-reports"
mkdir -p $REPORT_DIR
DATE=$(date +"%Y-%m-%d")

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Environment Variable Check
echo -e "${BLUE}[1/5]${NC} Checking environment variables for security issues..."
if [ -f "scripts/check-env-vars.js" ]; then
  node scripts/check-env-vars.js
  ENV_STATUS=$?
  if [ $ENV_STATUS -ne 0 ]; then
    echo -e "${RED}❌ Environment variable check failed${NC}"
    exit 1
  else
    echo -e "${GREEN}✓ Environment variables look secure${NC}"
  fi
else
  echo -e "${YELLOW}⚠️ Environment variable checker not found, skipping...${NC}"
fi

# 2. npm audit
echo -e "\n${BLUE}[2/5]${NC} Running npm security audit..."
npm audit --json > $REPORT_DIR/npm-audit-$DATE.json

# Check if there are high or critical vulnerabilities
HIGH_VULNS=$(cat $REPORT_DIR/npm-audit-$DATE.json | grep -c "\"severity\":\"high\"" || true)
CRITICAL_VULNS=$(cat $REPORT_DIR/npm-audit-$DATE.json | grep -c "\"severity\":\"critical\"" || true)

if [ $CRITICAL_VULNS -gt 0 ]; then
  echo -e "${RED}❌ Found $CRITICAL_VULNS critical vulnerabilities!${NC}"
  echo -e "${RED}   Review $REPORT_DIR/npm-audit-$DATE.json for details${NC}"
  CRITICAL_FOUND=true
else
  echo -e "${GREEN}✓ No critical vulnerabilities found${NC}"
fi

if [ $HIGH_VULNS -gt 0 ]; then
  echo -e "${YELLOW}⚠️ Found $HIGH_VULNS high severity vulnerabilities${NC}"
  echo -e "${YELLOW}   Review $REPORT_DIR/npm-audit-$DATE.json for details${NC}"
else
  echo -e "${GREEN}✓ No high severity vulnerabilities found${NC}"
fi

# 3. License check
echo -e "\n${BLUE}[3/5]${NC} Checking dependency licenses..."
npx license-checker --production --json > $REPORT_DIR/licenses-$DATE.json
npx license-checker --production --onlyAllow="MIT;ISC;Apache-2.0;BSD-2-Clause;BSD-3-Clause;CC0-1.0" --summary

if [ $? -ne 0 ]; then
  echo -e "${YELLOW}⚠️ Found potentially problematic licenses${NC}"
  echo -e "${YELLOW}   Review $REPORT_DIR/licenses-$DATE.json for details${NC}"
else
  echo -e "${GREEN}✓ All dependency licenses are compliant${NC}"
fi

# 4. Check for outdated packages
echo -e "\n${BLUE}[4/5]${NC} Checking for outdated packages..."
npm outdated --json > $REPORT_DIR/outdated-$DATE.json

# Count how many packages are outdated
OUTDATED_COUNT=$(cat $REPORT_DIR/outdated-$DATE.json | grep -c "\"type\":" || true)

if [ $OUTDATED_COUNT -gt 0 ]; then
  echo -e "${YELLOW}⚠️ Found $OUTDATED_COUNT outdated packages${NC}"
  echo -e "${YELLOW}   Review $REPORT_DIR/outdated-$DATE.json for details${NC}"
else
  echo -e "${GREEN}✓ All packages are up to date${NC}"
fi

# 5. Check for hard-coded secrets (simplified version)
echo -e "\n${BLUE}[5/5]${NC} Checking for hard-coded secrets..."
# Define patterns to search for (simplified version)
SECRET_PATTERNS=(
  "api[_-]?key"
  "access[_-]?token"
  "auth[_-]?token"
  "secret[_-]?key"
  "client[_-]?secret"
  "password"
  "BEGIN (RSA|DSA|EC) PRIVATE KEY"
)

# Build grep pattern
GREP_PATTERN=""
for pattern in "${SECRET_PATTERNS[@]}"; do
  GREP_PATTERN="$GREP_PATTERN -e \"$pattern\""
done

# Run the check but exclude node_modules, .git, etc.
SECRETS_COMMAND="grep -rn --include='*.{js,jsx,ts,tsx,json,env,yml,yaml}' $GREP_PATTERN . | grep -v \"node_modules\\|.git\\|package-lock.json\\|yarn.lock\""
SECRETS_RESULT=$(eval $SECRETS_COMMAND || true)

if [ -n "$SECRETS_RESULT" ]; then
  echo -e "${YELLOW}⚠️ Potential secrets found in code:${NC}"
  echo "$SECRETS_RESULT" | head -n 10
  if [ $(echo "$SECRETS_RESULT" | wc -l) -gt 10 ]; then
    echo -e "${YELLOW}   ...and more. Please review manually.${NC}"
  fi
  echo "$SECRETS_RESULT" > $REPORT_DIR/potential-secrets-$DATE.txt
else
  echo -e "${GREEN}✓ No obvious secrets found in code${NC}"
fi

# Summary
echo -e "\n${BLUE}=== Security Audit Summary ===${NC}"
echo -e "Date: $(date)"
echo -e "Report location: $REPORT_DIR"

if [ "$CRITICAL_FOUND" = true ]; then
  echo -e "${RED}❌ Critical issues found that need immediate attention${NC}"
  echo -e "${RED}   Please review the reports and fix critical vulnerabilities${NC}"
  exit 1
elif [ $HIGH_VULNS -gt 0 ] || [ $OUTDATED_COUNT -gt 10 ] || [ -n "$SECRETS_RESULT" ]; then
  echo -e "${YELLOW}⚠️ Potential security concerns found${NC}"
  echo -e "${YELLOW}   Please review the reports for details${NC}"
  exit 0
else
  echo -e "${GREEN}✅ No major security issues found${NC}"
  exit 0
fi 