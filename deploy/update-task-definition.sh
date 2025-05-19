#!/bin/bash
set -e

# Configuration
TASK_FAMILY="nokia-city-data-api"
SERVICE_NAME="nokia-city-data-api"
CLUSTER_NAME="osuuj-ecs-cluster"
AWS_REGION="eu-north-1"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Updating ECS task definition with SSL fixes${NC}"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to get AWS account ID. Make sure AWS CLI is configured.${NC}"
    exit 1
fi

# ECR repository URL
ECR_REPO_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/osuuj-city-data-api:latest"

# Get the current task definition
echo -e "${YELLOW}Getting current task definition...${NC}"
TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition $TASK_FAMILY --region $AWS_REGION)
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to get current task definition. Make sure the task definition exists.${NC}"
    exit 1
fi

# Create a new task definition file with updated image and environment variables
echo -e "${YELLOW}Creating new task definition...${NC}"
CONTAINER_DEFINITIONS=$(echo $TASK_DEFINITION | jq '.taskDefinition.containerDefinitions')
NEW_CONTAINER_DEFINITIONS=$(echo $CONTAINER_DEFINITIONS | jq '.[0].image = "'$ECR_REPO_URL'" | .[0].environment += [{"name": "DB_SSL_MODE", "value": "disable"}, {"name": "PGSSLMODE", "value": "disable"}]')

# Get other task definition parameters
EXECUTION_ROLE_ARN=$(echo $TASK_DEFINITION | jq -r '.taskDefinition.executionRoleArn')
TASK_ROLE_ARN=$(echo $TASK_DEFINITION | jq -r '.taskDefinition.taskRoleArn')
NETWORK_MODE=$(echo $TASK_DEFINITION | jq -r '.taskDefinition.networkMode')
CPU=$(echo $TASK_DEFINITION | jq -r '.taskDefinition.cpu')
MEMORY=$(echo $TASK_DEFINITION | jq -r '.taskDefinition.memory')
REQUIRES_COMPATIBILITIES=$(echo $TASK_DEFINITION | jq '.taskDefinition.requiresCompatibilities')

# Create new task definition JSON
NEW_TASK_DEFINITION=$(jq -n \
  --arg family "$TASK_FAMILY" \
  --arg executionRoleArn "$EXECUTION_ROLE_ARN" \
  --arg taskRoleArn "$TASK_ROLE_ARN" \
  --arg networkMode "$NETWORK_MODE" \
  --arg cpu "$CPU" \
  --arg memory "$MEMORY" \
  --argjson requiresCompatibilities "$REQUIRES_COMPATIBILITIES" \
  --argjson containerDefinitions "$NEW_CONTAINER_DEFINITIONS" \
  '{
    family: $family,
    executionRoleArn: $executionRoleArn,
    taskRoleArn: $taskRoleArn,
    networkMode: $networkMode,
    containerDefinitions: $containerDefinitions,
    requiresCompatibilities: $requiresCompatibilities,
    cpu: $cpu,
    memory: $memory
  }')

# Register the new task definition
echo -e "${YELLOW}Registering new task definition...${NC}"
NEW_TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
  --region $AWS_REGION \
  --cli-input-json "$NEW_TASK_DEFINITION" \
  --query 'taskDefinition.taskDefinitionArn' \
  --output text)

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to register new task definition.${NC}"
    exit 1
fi

echo -e "${GREEN}Successfully registered new task definition: $NEW_TASK_DEFINITION_ARN${NC}"

# Update the service with the new task definition
echo -e "${YELLOW}Updating ECS service with new task definition...${NC}"
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --task-definition $NEW_TASK_DEFINITION_ARN \
  --region $AWS_REGION \
  --force-new-deployment

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to update service with new task definition.${NC}"
    exit 1
fi

echo -e "${GREEN}Service update initiated. The new task will be deployed shortly.${NC}"
echo -e "${YELLOW}You can monitor the deployment with:${NC}"
echo -e "aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION"

exit 0
