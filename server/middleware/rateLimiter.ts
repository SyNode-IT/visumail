import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { AppError } from './errorHandler';

const limiters: Record<string, RateLimiterMemory> = {};

export const rateLimiter = (key: string, points: number, duration: number) => {
  if (!limiters[key]) {
    limiters[key] = new RateLimiterMemory({
      points,
      duration,
    });
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip;
      await limiters[key].consume(ip);
      next();
    } catch (error) {
      throw new AppError('Too many requests, please try again later', 429);
    }
  };
};