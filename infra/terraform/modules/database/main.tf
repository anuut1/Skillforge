variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "db_security_group_id" { type = string }
variable "kms_key_arn" { type = string }
variable "db_credentials_secret_arn" { type = string }

# RDS Subnet Group in private subnets
resource "aws_db_subnet_group" "rds_subnets" {
  name       = "skillforge-rds-subnet-group-${var.environment}"
  subnet_ids = var.private_subnet_ids
  tags       = { Name = "skillforge-rds-subnet-group-${var.environment}" }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  identifier            = "skillforge-db-${var.environment}"
  engine                = "postgres"
  engine_version        = "16.9"
  instance_class        = "db.t4g.micro"
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id            = var.kms_key_arn

  db_name                     = "skillforge"
  username                    = "skillforge_admin"
  manage_master_user_password = true


  db_subnet_group_name   = aws_db_subnet_group.rds_subnets.name
  vpc_security_group_ids = [var.db_security_group_id]

  multi_az            = false # Set true in production
  publicly_accessible = false
  skip_final_snapshot = true
  deletion_protection = false

  backup_retention_period    = 1
  auto_minor_version_upgrade = true

  tags = { Name = "skillforge-rds-${var.environment}" }
}

# DynamoDB Tables for High-Velocity Application State

# 1. DSA Submissions & Progress
resource "aws_dynamodb_table" "dsa_submissions" {
  name         = "SkillForge-DSASubmissions-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "problemId_timestamp"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "problemId_timestamp"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  global_secondary_index {
    name            = "StatusIndex"
    hash_key        = "status"
    range_key       = "userId"
    projection_type = "ALL"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = var.kms_key_arn
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = { Name = "SkillForge-DSASubmissions" }
}

# 2. Activity & Streaks
resource "aws_dynamodb_table" "user_activity" {
  name         = "SkillForge-UserActivity-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "activityDate"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "activityDate"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = var.kms_key_arn
  }

  tags = { Name = "SkillForge-UserActivity" }
}

# 3. Real-Time Notifications
resource "aws_dynamodb_table" "notifications" {
  name         = "SkillForge-Notifications-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "createdAt"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = var.kms_key_arn
  }

  tags = { Name = "SkillForge-Notifications" }
}

output "rds_endpoint" { value = aws_db_instance.postgres.endpoint }
output "rds_address" { value = aws_db_instance.postgres.address }
output "dsa_submissions_table" { value = aws_dynamodb_table.dsa_submissions.name }
output "notifications_table" { value = aws_dynamodb_table.notifications.name }
