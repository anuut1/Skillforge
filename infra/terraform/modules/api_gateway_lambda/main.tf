variable "environment" { type = string }
variable "cognito_user_pool_arn" { type = string }
variable "cognito_user_pool_endpoint" { type = string }
variable "cognito_client_id" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "lambda_security_group_id" { type = string }
variable "user_data_bucket_arn" { type = string }
variable "user_data_bucket_name" { type = string }
variable "kms_key_arn" { type = string }
variable "rds_endpoint" {
  type    = string
  default = ""
}
variable "db_credentials_secret_arn" {
  type    = string
  default = ""
}

# HTTP API Gateway (v2) for low latency & cost effectiveness
resource "aws_apigatewayv2_api" "http_api" {
  name          = "skillforge-api-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Authorization", "Content-Type", "x-amz-date", "x-api-key"]
    max_age       = 3600
  }

  tags = { Name = "skillforge-http-api-${var.environment}" }
}

# Cognito Authorizer on API Gateway
resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id           = aws_apigatewayv2_api.http_api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "skillforge-cognito-authorizer"

  jwt_configuration {
    audience = [var.cognito_client_id]
    issuer   = "https://${var.cognito_user_pool_endpoint}"
  }
}

# IAM Role for API Backend Lambda
resource "aws_iam_role" "api_lambda_role" {
  name = "skillforge-api-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_policy" "api_lambda_policy" {
  name        = "skillforge-api-lambda-policy-${var.environment}"
  description = "Least privilege permissions for SkillForge API backend"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${var.user_data_bucket_arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "textract:DetectDocumentText",
          "textract:StartDocumentTextDetection",
          "textract:GetDocumentTextDetection"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = var.kms_key_arn
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_lambda_attach" {
  role       = aws_iam_role.api_lambda_role.name
  policy_arn = aws_iam_policy.api_lambda_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_attach" {
  role       = aws_iam_role.api_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Backend Lambda Function connected to VPC (RDS Subnets)
resource "aws_lambda_function" "api_backend" {
  filename      = "${path.module}/../../lambda_dist/api_lambda.zip"
  function_name = "skillforge-api-backend-${var.environment}"
  role          = aws_iam_role.api_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 256

  source_code_hash = filebase64sha256("${path.module}/../../lambda_dist/api_lambda.zip")

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [var.lambda_security_group_id]
  }

  environment {
    variables = {
      ENVIRONMENT      = var.environment
      RDS_HOSTNAME     = var.rds_endpoint
      SECRETS_ARN      = var.db_credentials_secret_arn
      USER_DATA_BUCKET = var.user_data_bucket_name
    }
  }

  tags = {
    Name        = "skillforge-api-backend-${var.environment}"
    Environment = var.environment
    Project     = "SkillForge"
  }
}

# API Gateway Integration with Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api_backend.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# API Gateway Routes: Catch-All Proxy and Root
resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "proxy_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# Lambda Permission to allow invocation from API Gateway
resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_backend.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# API Stage with Throttling & Logging
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 500
    throttling_rate_limit  = 200
  }
}

output "api_endpoint" { value = aws_apigatewayv2_api.http_api.api_endpoint }
output "api_id" { value = aws_apigatewayv2_api.http_api.id }
output "lambda_role_arn" { value = aws_iam_role.api_lambda_role.arn }
output "lambda_function_arn" { value = aws_lambda_function.api_backend.arn }
output "lambda_function_name" { value = aws_lambda_function.api_backend.function_name }
