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

    let userId: string;

    // Try Cognito first if configured
    if (isCognitoConfigured()) {
      try {
        const cognitoPayload = await verifyCognitoToken(token);
        // Cognito sub is the unique user ID — find or create user in our DB
        const cognitoSub = cognitoPayload.sub;
        const email = (cognitoPayload as any)['email'] || (cognitoPayload as any)['username'] || '';
        const groups: string[] = (cognitoPayload as any)['cognito:groups'] || [];
        const role = groups.includes('instructors') ? 'INSTRUCTOR' : 'STUDENT';

        // Upsert user — creates on first Cognito login, updates role from group on subsequent logins
        let user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              id: cognitoSub,
              email,
              password: '', // No password needed for Cognito users
              name: email.split('@')[0], // Default name from email
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
