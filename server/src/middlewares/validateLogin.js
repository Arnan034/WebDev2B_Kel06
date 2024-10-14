// src/middlewares/validateLogin.js
const { body, validationResult } = require('express-validator');

const validateLogin = [
    body('username')
        .isString()
        .withMessage('Username is required and must be a string.'),
    body('password')
        .isLength({ min: 3 })
        .withMessage('Password must be at least 3 characters long.'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateLogin;
