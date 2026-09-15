import { CognitoJwtVerifier } from 'aws-jwt-verify';

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || '';
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '';
const COGNITO_REGION = process.env.COGNITO_REGION || 'ap-south-1';

// Create verifier for access tokens
const verifier = COGNITO_USER_POOL_ID ? CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: COGNITO_CLIENT_ID,
}) : null;

export async function verifyCognitoToken(token: string) {
  if (!verifier) throw new Error('Cognito not configured');
  return verifier.verify(token);
}

export function isCognitoConfigured(): boolean {
  return !!COGNITO_USER_POOL_ID && !!COGNITO_CLIENT_ID;
}
