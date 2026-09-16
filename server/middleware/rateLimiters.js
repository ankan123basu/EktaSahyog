import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts from this IP, please try again after 15 minutes.' }
});

export const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15, // limit each IP to 15 AI requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many AI requests. Please slow down.' }
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false
});
