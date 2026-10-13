const { body, validationResult } = require('express-validator');

// Validation rules for Name, Email, Password, and Address
const userValidationRules = () => {
  return [
    body('name')
      .isLength({ min: 20, max: 60 })
      .withMessage('Name must be between 20 and 60 characters long.'),
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address.'),
    body('address')
      .isLength({ max: 400 })
      .withMessage('Address cannot exceed 400 characters.')
      .notEmpty()
      .withMessage('Address is required.'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters.')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter.')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Password must contain at least one special character.')
  ];
};

// Validation middleware to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
    message: errors.array()[0].msg
  });
};

module.exports = {
  userValidationRules,
  validate
};