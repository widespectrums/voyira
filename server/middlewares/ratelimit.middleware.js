import rateLimit from "express-rate-limit";
import { TooManyRequestsError } from '../errors/api.error.js';

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyGenerator: (req) => req.ip,
    handler: (req, res, next) => {
        next(new TooManyRequestsError('Too many requests'));
    }
});

export const authRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts'
});

export default apiLimiter;
