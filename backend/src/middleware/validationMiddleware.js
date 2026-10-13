const { body, validationResult } = require('express-validator');

// Helper middleware to catch validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: errors.array()[0].msg, 
      errors: errors.array() 
    });
  }
  next();
};

// 1. User Registration Validation Rules
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters long.'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address.'),
  body('address')
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage('Address cannot exceed 400 characters.'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character.'),
  handleValidationErrors
];

// 2. Login Validation Rules
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
  handleValidationErrors
];

// 3. Password Update Validation Rules
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters.')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('New password must contain at least one special character.'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordUpdate
};