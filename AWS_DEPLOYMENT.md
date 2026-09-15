# SkillForge - AWS End-to-End Deployment Guide

## Deployment Lifecycle
This guide outlines deploying SkillForge to AWS across development, staging, and production environments.

## Automated CI/CD (GitHub Actions)
SkillForge includes a complete GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. **Pull Request / Commit Trigger**:
   - Compiles and validates TypeScript across both `/server` and `/client`.
   - Runs automated resilience, assertion, and AI tests.
2. **Main Branch Deploy**:
   - Assumes AWS IAM Role via OpenID Connect (OIDC) without long-lived access keys.
   - Syncs the production React/Vite bundle to S3.
   - Issues a CloudFront cache invalidation (`/*`) for immediate global propagation.

## Manual Step-by-Step Deployment

### 1. Provision Infrastructure
```bash
cd infra/terraform
terraform init
terraform apply -var="environment=prod" -var="aws_region=ap-south-1"
```

### 2. Configure RDS Database Schema
```bash
cd ../../server
# Point DATABASE_URL to your RDS PostgreSQL endpoint stored in AWS Secrets Manager
npx prisma migrate deploy
npm run db:seed
```

### 3. Deploy Server Container to Amazon ECS Fargate
```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# Build and Push
docker build -t skillforge-server -f ../infra/docker/Dockerfile.server .
docker tag skillforge-server:latest <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/skillforge-server:latest
docker push <ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/skillforge-server:latest

# Trigger ECS Service Update
aws ecs update-service --cluster skillforge-cluster --service skillforge-server-service --force-new-deployment
```

### 4. Build and Deploy React Frontend
```bash
cd ../client
# Ensure .env has your production VITE_COGNITO_USER_POOL_ID and VITE_COGNITO_CLIENT_ID
npm run build
aws s3 sync dist/ s3://skillforge-frontend-prod --delete
aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
```
