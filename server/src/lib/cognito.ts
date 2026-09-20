import { CognitoJwtVerifier } from 'aws-jwt-verify';

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || '';
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '';
const COGNITO_REGION = process.env.COGNITO_REGION || 'ap-south-1';

// Create verifiers for access and id tokens
const accessVerifier = COGNITO_USER_POOL_ID ? CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: COGNITO_CLIENT_ID,
}) : null;

const idVerifier = COGNITO_USER_POOL_ID ? CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: 'id',
  clientId: COGNITO_CLIENT_ID,
}) : null;

export async function verifyCognitoToken(token: string) {
  if (!accessVerifier && !idVerifier) throw new Error('Cognito not configured');
  try {
    if (accessVerifier) {
      return await accessVerifier.verify(token);
    }
  } catch (err) {
    if (idVerifier) {
      return await idVerifier.verify(token);
    }
    throw err;
  }
  if (idVerifier) {
    return await idVerifier.verify(token);
  }
  throw new Error('Token verification failed');
}

export function isCognitoConfigured(): boolean {
  return !!COGNITO_USER_POOL_ID && !!COGNITO_CLIENT_ID;
}
