#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Prompt for RDS endpoint directly
echo -e "${YELLOW}Enter RDS endpoint (e.g., database.region.rds.amazonaws.com):${NC}"
read -r RDS_ENDPOINT

echo -e "${YELLOW}Testing database connection to $RDS_ENDPOINT${NC}"
echo -e "${YELLOW}Enter database username:${NC}"
read -r DB_USER

echo -e "${YELLOW}Enter database password:${NC}"
read -rs DB_PASSWORD
echo ""

echo -e "${YELLOW}Enter database name:${NC}"
read -r DB_NAME

# Test connection with SSL disabled
echo -e "${YELLOW}Testing connection with SSL disabled (PGSSLMODE=disable)...${NC}"
PGPASSWORD=$DB_PASSWORD PGSSLMODE=disable psql -h "$RDS_ENDPOINT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1 as connection_test;"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Success! Connection to database with SSL disabled works.${NC}"
    echo -e "${YELLOW}This confirms your task should work with DB_SSL_MODE=disable and PGSSLMODE=disable env variables.${NC}"
else
    echo -e "${RED}Failed to connect with SSL disabled.${NC}"
    echo -e "${YELLOW}Make sure:${NC}"
    echo -e "1. ECS security group can access RDS on port 5432"
    echo -e "2. Database credentials are correct"
    echo -e "3. Database exists"
fi

# Instructions for updating ECS
echo -e "\n${YELLOW}To fix the ECS task issue:${NC}"
echo -e "1. Run the build script to create an SSL-patched image:"
echo -e "   ${GREEN}./deploy/build-and-push.sh${NC}"
echo -e "2. Update the ECS task definition with the SSL-patched image:"
echo -e "   ${GREEN}./deploy/update-task-definition.sh${NC}"
echo -e "3. Monitor the deployment in AWS console or with AWS CLI"

exit 0
