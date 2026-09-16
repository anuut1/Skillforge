const POOL_DATA = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
};

export function isCognitoEnabled(): boolean {
  return !!POOL_DATA.UserPoolId && !!POOL_DATA.ClientId;
}

export async function cognitoSignUp(email: string, password: string, name: string): Promise<any> {
  if (!isCognitoEnabled()) throw new Error('Cognito not configured');
  const { CognitoUserPool, CognitoUserAttribute } = await import('amazon-cognito-identity-js');
  const userPool = new CognitoUserPool(POOL_DATA);

  return new Promise((resolve, reject) => {
    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
    ];
    userPool.signUp(email, password, attributes, [], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function cognitoConfirmSignUp(email: string, code: string): Promise<any> {
  if (!isCognitoEnabled()) throw new Error('Cognito not configured');
  const { CognitoUserPool, CognitoUser } = await import('amazon-cognito-identity-js');
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = new CognitoUser({ Username: email, Pool: userPool });

  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function cognitoResendConfirmationCode(email: string): Promise<any> {
  if (!isCognitoEnabled()) throw new Error('Cognito not configured');
  const { CognitoUserPool, CognitoUser } = await import('amazon-cognito-identity-js');
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = new CognitoUser({ Username: email, Pool: userPool });

  return new Promise((resolve, reject) => {
    user.resendConfirmationCode((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function cognitoForgotPassword(email: string): Promise<any> {
  if (!isCognitoEnabled()) throw new Error('Cognito not configured');
  const { CognitoUserPool, CognitoUser } = await import('amazon-cognito-identity-js');
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = new CognitoUser({ Username: email, Pool: userPool });

  return new Promise((resolve, reject) => {
    user.forgotPassword({
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(err),
    });
  });
}

export async function cognitoConfirmPassword(email: string, code: string, newPass: string): Promise<any> {
  if (!isCognitoEnabled()) throw new Error('Cognito not configured');
  const { CognitoUserPool, CognitoUser } = await import('amazon-cognito-identity-js');
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = new CognitoUser({ Username: email, Pool: userPool });

  return new Promise((resolve, reject) => {
    user.confirmPassword(code, newPass, {
      onSuccess: () => resolve(true),
      onFailure: (err) => reject(err),
    });
  });
}

export async function cognitoSignIn(email: string, password: string): Promise<string> {
  if (!isCognitoEnabled()) throw new Error('Cognito not configured');
  const { CognitoUserPool, CognitoUser, AuthenticationDetails } = await import('amazon-cognito-identity-js');
  const userPool = new CognitoUserPool(POOL_DATA);

  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session.getAccessToken().getJwtToken()),
      onFailure: (err) => reject(err),
    });
  });
}

export async function cognitoSignOut(): Promise<void> {
  if (!isCognitoEnabled()) return;
  const { CognitoUserPool } = await import('amazon-cognito-identity-js');
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = userPool.getCurrentUser();
  if (user) user.signOut();
}

export async function cognitoGetCurrentToken(): Promise<string | null> {
  if (!isCognitoEnabled()) return null;
  const { CognitoUserPool } = await import('amazon-cognito-identity-js');
  const userPool = new CognitoUserPool(POOL_DATA);
  const user = userPool.getCurrentUser();
  if (!user) return null;

  return new Promise((resolve) => {
    user.getSession((err: any, session: any) => {
      if (err || !session?.isValid()) return resolve(null);
      resolve(session.getAccessToken().getJwtToken());
    });
  });
}
