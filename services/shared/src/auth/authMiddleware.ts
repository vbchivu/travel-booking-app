// src/auth/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return; // Ensure function exits after sending response
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded; // Attach user info to request
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
        return; // Explicitly return `void` here
    }
};
