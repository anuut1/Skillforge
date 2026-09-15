# SkillForge - AWS Setup & Deployment Guide

## Prerequisites
- Node.js 20+ and npm 10+
- AWS CLI v2 (`aws --version`)
- Terraform 1.5+ (`terraform -v`)
- Docker Desktop (for containerized builds)

## Local Development (No AWS Account Required)
1. **Server Setup**:
   ```bash
   cd server
   cp .env.example .env
   npm install
   npm run db:migrate
   npm run dev
   ```
2. **Client Setup**:
   ```bash
   cd client
   cp .env.example .env
   npm install
   npm run dev
   ```
3. The client will be accessible at `http://localhost:5173` and the API at `http://localhost:5000`.

## AWS Infrastructure Provisioning (Terraform)
1. Navigate to the infrastructure directory:
   ```bash
   cd infra/terraform
   ```
2. Initialize Terraform providers:
   ```bash
   terraform init
   ```
3. Plan infrastructure:
   ```bash
   terraform plan -var="environment=dev" -var="aws_region=ap-south-1"
   ```
4. Apply infrastructure:
   ```bash
   terraform apply -var="environment=dev" -var="aws_region=ap-south-1" -auto-approve
   ```
5. Note the output values:
   - `cloudfront_distribution_domain`
   - `cognito_user_pool_id`
   - `cognito_client_id`
   - `api_gateway_endpoint`
   - `user_data_s3_bucket`

## Frontend Deployment to S3 & CloudFront
1. Build the Vite application with production API and Cognito credentials:
   ```bash
   cd client
   npm run build
   ```
2. Sync the compiled `dist/` directory to the S3 frontend bucket:
   ```bash
   aws s3 sync dist/ s3://skillforge-frontend-dev --delete
   ```
3. Create a CloudFront cache invalidation:
   ```bash
   aws cloudfront create-invalidation --distribution-id <DISTRIBUTION_ID> --paths "/*"
   ```

## Backend Deployment (Lambda or ECS Fargate)
1. Compile backend:
   ```bash
   cd server
   npm run build
   ```
2. For ECS deployment:
   ```bash
   docker build -t skillforge-server -f ../infra/docker/Dockerfile.server .
   aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ECR_URL>
   docker tag skillforge-server:latest <ECR_URL>:latest
   docker push <ECR_URL>:latest
   ```
