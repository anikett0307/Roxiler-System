const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, validatePasswordUpdate } = require('../middleware/validationMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.put('/update-password', authenticateToken, validatePasswordUpdate, authController.updatePassword);

module.exports = router;