output "cloudfront_distribution_domain" {
  description = "CloudFront default domain name for the frontend SPA"
  value       = module.s3_cloudfront.cloudfront_domain_name
}

output "cognito_user_pool_id" {
  description = "Amazon Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "Amazon Cognito App Client ID"
  value       = module.cognito.client_id
}

output "api_gateway_endpoint" {
  description = "REST / HTTP API Gateway invoke URL"
  value       = module.api_gateway_lambda.api_endpoint
}

output "user_data_s3_bucket" {
  description = "Private S3 bucket name for sensitive user data and resumes"
  value       = module.s3_cloudfront.user_data_bucket_name
}

output "rds_postgresql_endpoint" {
  description = "RDS PostgreSQL database endpoint"
  value       = module.database.rds_endpoint
}

output "lambda_backend_function_name" {
  description = "Backend Lambda function connected to VPC RDS and API Gateway"
  value       = module.api_gateway_lambda.lambda_function_name
}
