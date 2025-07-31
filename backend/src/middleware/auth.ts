import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/environment';
import { createError } from './errorHandler';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  stellarPublicKey?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    stellarPublicKey?: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Access token is required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      ...(decoded.stellarPublicKey && { stellarPublicKey: decoded.stellarPublicKey }),
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid access token', 401));
    } else {
      next(error);
    }
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(createError('Insufficient permissions', 403));
    }
    
    next();
  };
};
