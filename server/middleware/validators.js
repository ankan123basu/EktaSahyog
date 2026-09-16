import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateRegister = [
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    handleValidationErrors
];

export const validateLogin = [
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

export const validateMarketplaceItem = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('price').isNumeric().withMessage('Price must be a valid number'),
    body('artisan').trim().notEmpty().withMessage('Artisan name is required'),
    body('region').trim().notEmpty().withMessage('Region is required'),
    handleValidationErrors
];

export const validateProjectItem = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    handleValidationErrors
];
