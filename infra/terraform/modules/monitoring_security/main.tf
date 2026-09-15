variable "environment" { type = string }

# KMS Customer Managed Key for SkillForge data encryption
resource "aws_kms_key" "main" {
  description             = "KMS CMK for SkillForge encryption at rest"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = { Name = "skillforge-cmk-${var.environment}" }
}

resource "aws_kms_alias" "main_alias" {
  name          = "alias/skillforge-${var.environment}"
  target_key_id = aws_kms_key.main.key_id
}

# Secrets Manager for Database Credentials
resource "aws_secretsmanager_secret" "db_credentials" {
  name                    = "skillforge/database/${var.environment}"
  kms_key_id              = aws_kms_key.main.id
  recovery_window_in_days = 0
}

resource "random_password" "db_password" {
  length  = 24
  special = false
}

resource "aws_secretsmanager_secret_version" "db_credentials_version" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "skillforge_admin"
    password = random_password.db_password.result
    dbname   = "skillforge"
    engine   = "postgres"
    port     = 5432
  })
}

# CloudTrail for Governance and Audit Logging
resource "aws_s3_bucket" "cloudtrail_bucket" {
  bucket        = "skillforge-cloudtrail-logs-${var.environment}"
  force_destroy = false
}

resource "aws_s3_bucket_public_access_block" "cloudtrail_pab" {
  bucket                  = aws_s3_bucket.cloudtrail_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "cloudtrail_policy" {
  bucket = aws_s3_bucket.cloudtrail_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSCloudTrailAclCheck"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.cloudtrail_bucket.arn
      },
      {
        Sid    = "AWSCloudTrailWrite"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.cloudtrail_bucket.arn}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      }
    ]
  })
}

resource "aws_cloudtrail" "main" {
  name                          = "skillforge-audit-trail-${var.environment}"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_bucket.id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_logging                = true
  enable_log_file_validation    = true
  depends_on                    = [aws_s3_bucket_policy.cloudtrail_policy]
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "SkillForge-Platform-${var.environment}"
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApiGateway", "5XXError", { stat = "Sum", period = 300, color = "#d62728" }],
            [".", "4XXError", { stat = "Sum", period = 300, color = "#ff7f0e" }],
            [".", "Count", { stat = "Sum", period = 300, color = "#1f77b4" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = "ap-south-1"
          title   = "API Gateway Traffic & Errors"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", { stat = "Sum", period = 300, color = "#d62728" }],
            [".", "Invocations", { stat = "Sum", period = 300, color = "#2ca02c" }],
            [".", "Duration", { stat = "Average", period = 300, color = "#9467bd" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = "ap-south-1"
          title   = "Lambda Invocations & Latency"
        }
      }
    ]
  })
}

# AWS Budgets Billing Alert
resource "aws_budgets_budget" "monthly_budget" {
  name         = "skillforge-monthly-budget-${var.environment}"
  budget_type  = "COST"
  limit_amount = "50"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["anushree.tiwari2024@vitstuden.ac.in"]
  }
}

output "kms_key_arn" { value = aws_kms_key.main.arn }
output "kms_key_id" { value = aws_kms_key.main.id }
output "db_credentials_secret_arn" { value = aws_secretsmanager_secret.db_credentials.arn }
output "db_password" {
  value     = random_password.db_password.result
  sensitive = true
}
