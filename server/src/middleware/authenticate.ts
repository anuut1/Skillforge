import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import { verifyCognitoToken, isCognitoConfigured } from '../lib/cognito';
import prisma from '../lib/prisma';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // Try Cognito first if configured
    if (isCognitoConfigured()) {
      try {
        const cognitoPayload = await verifyCognitoToken(token);
        const cognitoSub = cognitoPayload.sub;
        const email = (cognitoPayload as any)['email'] || (cognitoPayload as any)['username'] || '';
        const groups: string[] = (cognitoPayload as any)['cognito:groups'] || [];
        const role = groups.includes('instructors') ? 'INSTRUCTOR' : 'STUDENT';

        let user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              id: cognitoSub,
              email,
              password: '',
              name: email.split('@')[0],
              role,
            },
          });
        }
        (req as any).user = user;
        return next();
      } catch {
        // Cognito verification failed, try local JWT below
      }
    }

    // Fall back to local JWT
    try {
      const decoded = verifyToken(token) as any;
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });
      (req as any).user = user;
      next();
    } catch {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

/**
 * Optional authentication: attaches user if valid token exists,
 * but proceeds without error if unauthenticated or token is missing.
 */
export const optionalAuthenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];

    if (isCognitoConfigured()) {
      try {
        const cognitoPayload = await verifyCognitoToken(token);
        const email = (cognitoPayload as any)['email'] || (cognitoPayload as any)['username'] || '';
        const user = await prisma.user.findFirst({ where: { email } });
        if (user) {
          (req as any).user = user;
          return next();
        }
      } catch {}
    }

    try {
      const decoded = verifyToken(token) as any;
      if (decoded?.id) {
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (user) {
          (req as any).user = user;
        }
      }
    } catch {}

    next();
  } catch {
    next();
  }
};
