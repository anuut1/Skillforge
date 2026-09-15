import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

const REGION = process.env.AWS_REGION || process.env.COGNITO_REGION || 'ap-south-1';

export const secretsClient = new SecretsManagerClient({
  region: REGION,
});

/**
 * Retrieve JSON secret from AWS Secrets Manager with local fallback
 */
export async function getSecret<T>(secretId: string, defaultValue?: T): Promise<T> {
  if (!process.env.AWS_REGION && !process.env.AWS_DEFAULT_REGION) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error('AWS environment not available to retrieve secret: ' + secretId);
  }

  try {
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const response = await secretsClient.send(command);

    if (response.SecretString) {
      return JSON.parse(response.SecretString) as T;
    }
    if (defaultValue !== undefined) return defaultValue;
    throw new Error('Empty secret content for ' + secretId);
  } catch (error) {
    if (defaultValue !== undefined) return defaultValue;
    throw error;
  }
}
