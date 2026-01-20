#!/bin/bash

# Script to deploy project to Contentstack Launch 10 times
# This triggers deployments by making commits and pushing to the repository

DEPLOY_COUNT=10
DELAY_BETWEEN_DEPLOYS=5  # seconds to wait between deploys

echo "Starting $DEPLOY_COUNT deployments to Contentstack Launch..."
echo "=============================================="

for i in $(seq 1 $DEPLOY_COUNT); do
  echo ""
  echo "Deployment $i of $DEPLOY_COUNT"
  echo "------------------------------"
  
  # Create a small change to trigger deployment
  TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
  echo "// Deployment test #$i - $TIMESTAMP" >> functions/[proxy].edge.js
  
  # Stage and commit the change
  git add functions/[proxy].edge.js
  git commit -m "Test deployment #$i - $TIMESTAMP"
  
  # Push to trigger deployment
  echo "Pushing to trigger deployment..."
  git push
  
  if [ $? -eq 0 ]; then
    echo "✓ Deployment #$i triggered successfully"
  else
    echo "✗ Deployment #$i failed to push"
  fi
  
  # Wait before next deployment (skip wait on last iteration)
  if [ $i -lt $DEPLOY_COUNT ]; then
    echo "Waiting $DELAY_BETWEEN_DEPLOYS seconds before next deployment..."
    sleep $DELAY_BETWEEN_DEPLOYS
  fi
done

echo ""
echo "=============================================="
echo "Completed $DEPLOY_COUNT deployment attempts"
echo "Check Contentstack Launch dashboard for deployment logs"

