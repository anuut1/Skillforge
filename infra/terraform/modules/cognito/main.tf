variable "environment" { type = string }

resource "aws_cognito_user_pool" "pool" {
  name                     = "skillforge-user-pool-${var.environment}"
  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "SkillForge Account Verification Code"
    email_message        = "Welcome to SkillForge! Your verification code is {####}. Enter this code to verify your account."
  }

  schema {
    attribute_data_type = "String"
    name                = "name"
    required            = true
    mutable             = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = { Name = "skillforge-user-pool-${var.environment}" }
}

# User Pool Client (Public SPA client without client secret)
resource "aws_cognito_user_pool_client" "client" {
  name         = "skillforge-web-client-${var.environment}"
  user_pool_id = aws_cognito_user_pool.pool.id

  generate_secret = false
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  prevent_user_existence_errors = "ENABLED"
  enable_token_revocation       = true
  access_token_validity         = 60 # 60 minutes
  id_token_validity             = 60
  refresh_token_validity        = 30 # 30 days
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
}

# Role Groups
resource "aws_cognito_user_group" "students" {
  name         = "students"
  user_pool_id = aws_cognito_user_pool.pool.id
  description  = "SkillForge Students group"
  precedence   = 10
}

resource "aws_cognito_user_group" "instructors" {
  name         = "instructors"
  user_pool_id = aws_cognito_user_pool.pool.id
  description  = "SkillForge Instructors & Course Creators group"
  precedence   = 5
}

resource "aws_cognito_user_group" "admins" {
  name         = "administrators"
  user_pool_id = aws_cognito_user_pool.pool.id
  description  = "SkillForge Administrators group"
  precedence   = 1
}

output "user_pool_id" { value = aws_cognito_user_pool.pool.id }
output "user_pool_arn" { value = aws_cognito_user_pool.pool.arn }
output "client_id" { value = aws_cognito_user_pool_client.client.id }
