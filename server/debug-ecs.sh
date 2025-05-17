#!/bin/bash
# Debugging script for ECS container issues

# Set variables
CLUSTER_NAME="your-cluster-name"
SERVICE_NAME="your-service-name"

# Get the latest task ARN
TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --query 'taskArns[0]' --output text)

if [ -z "$TASK_ARN" ]; then
  echo "❌ No running tasks found for service $SERVICE_NAME in cluster $CLUSTER_NAME"
  exit 1
fi

echo "🔍 Found task: $TASK_ARN"

# Get container instance ARN
CONTAINER_INSTANCE=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --query 'tasks[0].containerInstanceArn' --output text)

if [ -z "$CONTAINER_INSTANCE" ]; then
  echo "❌ Container instance not found for task $TASK_ARN"
  exit 1
fi

echo "🔍 Found container instance: $CONTAINER_INSTANCE"

# Get EC2 instance ID
EC2_INSTANCE=$(aws ecs describe-container-instances --cluster $CLUSTER_NAME --container-instances $CONTAINER_INSTANCE --query 'containerInstances[0].ec2InstanceId' --output text)

if [ -z "$EC2_INSTANCE" ]; then
  echo "❌ EC2 instance not found for container instance $CONTAINER_INSTANCE"
  exit 1
fi

echo "🔍 Found EC2 instance: $EC2_INSTANCE"

# Instructions for using ECS Exec or SSM
echo ""
echo "To connect directly to the container (requires SSM enabled in task definition):"
echo "aws ecs execute-command --cluster $CLUSTER_NAME --task $TASK_ARN --container fastapi-container --command /bin/bash --interactive"
echo ""

# Print environment variables for debugging
echo "To dump all environment variables:"
echo "aws ecs execute-command --cluster $CLUSTER_NAME --task $TASK_ARN --container fastapi-container --command 'printenv | grep -E \"DATABASE|POSTGRES\"' --interactive"
echo ""

# Check DATABASE_URL specifically
echo "To check if DATABASE_URL is directly set:"
echo "aws ecs execute-command --cluster $CLUSTER_NAME --task $TASK_ARN --container fastapi-container --command 'echo \$DATABASE_URL' --interactive"
echo ""

# Instructions to check database connectivity
echo "To test database connectivity directly:"
echo "aws ecs execute-command --cluster $CLUSTER_NAME --task $TASK_ARN --container fastapi-container --command 'apt-get update && apt-get install -y postgresql-client && PGPASSWORD=\$POSTGRES_PASSWORD psql -h \$POSTGRES_HOST -U \$POSTGRES_USER -d \$POSTGRES_DB -c \"SELECT 1\"' --interactive"
echo "" 