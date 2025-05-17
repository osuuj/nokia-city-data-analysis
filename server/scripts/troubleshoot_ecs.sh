#!/bin/bash
# Script to troubleshoot ECS deployment issues
# Use this after a failed deployment to diagnose common problems

set -e
echo "🔍 ECS Troubleshooting Tool"

# Get cluster and service from environment or arguments
ECS_CLUSTER=${1:-${FASTAPI_ECS_CLUSTER}}
ECS_SERVICE=${2:-${ECS_SERVICE}}

if [ -z "$ECS_CLUSTER" ] || [ -z "$ECS_SERVICE" ]; then
  echo "⚠️ Missing required parameters"
  echo "Usage: $0 <ecs-cluster> <ecs-service>"
  echo "Or set FASTAPI_ECS_CLUSTER and ECS_SERVICE environment variables"
  exit 1
fi

echo "🔍 Checking ECS service: $ECS_SERVICE in cluster: $ECS_CLUSTER"

# Check service status
echo "Checking service status..."
aws ecs describe-services \
  --cluster $ECS_CLUSTER \
  --services $ECS_SERVICE \
  --query 'services[0].{Status:status,DesiredCount:desiredCount,RunningCount:runningCount,PendingCount:pendingCount}' \
  --output table

# Check recent events
echo "Recent service events:"
aws ecs describe-services \
  --cluster $ECS_CLUSTER \
  --services $ECS_SERVICE \
  --query 'services[0].events[0:5]' \
  --output table

# Get task definition
TASK_DEF_ARN=$(aws ecs describe-services \
  --cluster $ECS_CLUSTER \
  --services $ECS_SERVICE \
  --query 'services[0].taskDefinition' \
  --output text)

echo "Task definition: $TASK_DEF_ARN"

# Check task definition
aws ecs describe-task-definition \
  --task-definition $TASK_DEF_ARN \
  --query 'taskDefinition.containerDefinitions[0].{Image:image,Memory:memory,CPU:cpu,Environment:environment,Secrets:secrets}' \
  --output yaml

# Get stopped tasks to check for errors
STOPPED_TASKS=$(aws ecs list-tasks \
  --cluster $ECS_CLUSTER \
  --service-name $ECS_SERVICE \
  --desired-status STOPPED \
  --query 'taskArns' \
  --output text)

if [ -n "$STOPPED_TASKS" ]; then
  echo "Found stopped tasks, checking reasons..."
  
  for TASK in $STOPPED_TASKS; do
    echo "Task: $TASK"
    aws ecs describe-tasks \
      --cluster $ECS_CLUSTER \
      --tasks $TASK \
      --query 'tasks[0].{StoppedReason:stoppedReason,Containers:containers[].{Name:name,Reason:reason,ExitCode:exitCode}}' \
      --output yaml
    
    # Get logs for stopped task
    CONTAINER_NAME=$(aws ecs describe-task-definition \
      --task-definition $TASK_DEF_ARN \
      --query 'taskDefinition.containerDefinitions[0].name' \
      --output text)
    
    TASK_ID=$(echo $TASK | cut -d'/' -f2)
    
    echo "Last 20 log lines for $CONTAINER_NAME in task $TASK_ID:"
    aws logs get-log-events \
      --log-group "/ecs/$ECS_CLUSTER/$CONTAINER_NAME" \
      --log-stream "ecs/$CONTAINER_NAME/$TASK_ID" \
      --limit 20 \
      --query 'events[*].message' \
      --output text || echo "No logs found"
  done
else
  echo "No stopped tasks found."
fi

# Check if secrets are accessible
echo "Checking if the task execution role can access the secrets..."
EXEC_ROLE_ARN=$(aws ecs describe-task-definition \
  --task-definition $TASK_DEF_ARN \
  --query 'taskDefinition.executionRoleArn' \
  --output text)

if [ -n "$EXEC_ROLE_ARN" ]; then
  echo "Task execution role: $EXEC_ROLE_ARN"
  
  # Get the role name from ARN
  ROLE_NAME=$(echo $EXEC_ROLE_ARN | cut -d'/' -f2)
  
  # Check if role has permission to access secrets
  aws iam list-role-policies \
    --role-name $ROLE_NAME \
    --query 'PolicyNames' \
    --output text
  
  aws iam list-attached-role-policies \
    --role-name $ROLE_NAME \
    --query 'AttachedPolicies[].PolicyName' \
    --output text
else
  echo "⚠️ No execution role found in task definition"
fi

echo "✅ Troubleshooting complete. Check the output for any error messages." 