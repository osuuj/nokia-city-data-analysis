#!/bin/bash
set -e

# Configuration
ECR_REPOSITORY="osuuj-city-data-api"
AWS_REGION="eu-north-1"
IMAGE_TAG="latest"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building and pushing Docker image with SSL patch${NC}"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to get AWS account ID. Make sure AWS CLI is configured.${NC}"
    exit 1
fi

# ECR repository URL
ECR_REPO_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

echo -e "${YELLOW}Logging in to Amazon ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Create repository if it doesn't exist
aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION} || aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${AWS_REGION}

# Build the image using the SSL-patched Dockerfile
echo -e "${YELLOW}Building Docker image using Dockerfile.ssl-patch...${NC}"
echo -e "${YELLOW}Building from server directory...${NC}"

# Build from the server directory where the required files are located
cd server
docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} -f Dockerfile .

# Return to original directory
cd ..

# Tag and push the image
echo -e "${YELLOW}Tagging and pushing image to ECR...${NC}"
docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${ECR_REPO_URL}:${IMAGE_TAG}
docker push ${ECR_REPO_URL}:${IMAGE_TAG}

echo -e "${GREEN}Successfully built and pushed image: ${ECR_REPO_URL}:${IMAGE_TAG}${NC}"
echo -e "${YELLOW}Now update your ECS task definition with:${NC}"
echo -e "  - Image: ${ECR_REPO_URL}:${IMAGE_TAG}"
echo -e "  - Environment variables: DB_SSL_MODE=disable PGSSLMODE=disable"

exit 0
