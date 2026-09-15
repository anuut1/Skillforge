terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "SkillForge"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# 1. Networking (VPC & Subnets)
module "vpc" {
  source      = "./modules/vpc"
  environment = var.environment
}

# 2. Security & Encryption (KMS & Secrets Manager)
module "monitoring_security" {
  source      = "./modules/monitoring_security"
  environment = var.environment
}

# 3. Storage & CDN (S3 & CloudFront)
module "s3_cloudfront" {
  source          = "./modules/s3_cloudfront"
  environment     = var.environment
  kms_key_arn     = module.monitoring_security.kms_key_arn
  domain_name     = var.domain_name
  route53_zone_id = var.route53_zone_id
}

# 4. Identity & Authentication (Amazon Cognito)
module "cognito" {
  source      = "./modules/cognito"
  environment = var.environment
}

# 5. Database Tier (RDS PostgreSQL & DynamoDB)
module "database" {
  source                    = "./modules/database"
  environment               = var.environment
  vpc_id                    = module.vpc.vpc_id
  private_subnet_ids        = module.vpc.private_subnet_ids
  db_security_group_id      = module.vpc.db_security_group_id
  kms_key_arn               = module.monitoring_security.kms_key_arn
  db_credentials_secret_arn = module.monitoring_security.db_credentials_secret_arn
}

# 6. Compute & API (API Gateway & Lambdas / ECS)
module "api_gateway_lambda" {
  source                   = "./modules/api_gateway_lambda"
  environment              = var.environment
  cognito_user_pool_arn    = module.cognito.user_pool_arn
  cognito_client_id        = module.cognito.client_id
  vpc_id                   = module.vpc.vpc_id
  private_subnet_ids       = module.vpc.private_subnet_ids
  lambda_security_group_id = module.vpc.lambda_security_group_id
  user_data_bucket_arn     = module.s3_cloudfront.user_data_bucket_arn
  user_data_bucket_name    = module.s3_cloudfront.user_data_bucket_name
  kms_key_arn              = module.monitoring_security.kms_key_arn
}

# 7. Asynchronous AI Pipeline (SQS, SNS, EventBridge, Step Functions)
module "ai_pipeline" {
  source                = "./modules/ai_pipeline"
  environment           = var.environment
  kms_key_arn           = module.monitoring_security.kms_key_arn
  user_data_bucket_arn  = module.s3_cloudfront.user_data_bucket_arn
  user_data_bucket_name = module.s3_cloudfront.user_data_bucket_name
}
