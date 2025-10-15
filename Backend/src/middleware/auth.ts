import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {

  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Authorization required' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; email: string };
    req.user = decoded;
    next();
  } 
  catch {
    res.status(403).json({ message: 'Invalid/expired token' });
  }
}
