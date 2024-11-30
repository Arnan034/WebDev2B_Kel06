// src/middlewares/validateLogin.js
const { body, validationResult } = require('express-validator');

const validateSignin = [
    body('username').isLength({min: 4})
        .isString()
        .withMessage('Username is required and must be a string.'),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 3 characters long.'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateSignup = [
    body('username')
        .isLength({min: 4})
        .isString()
        .withMessage('Username harus minimal 4 karakter dan berupa string.')
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Email tidak valid.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password harus minimal 4 karakter.'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateSignin, validateSignup };
    