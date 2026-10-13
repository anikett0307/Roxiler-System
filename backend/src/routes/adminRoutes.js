const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/dashboard', authenticateToken, authorizeRoles('SYSTEM_ADMIN'), adminController.getDashboardStats);
router.post('/users', authenticateToken, authorizeRoles('SYSTEM_ADMIN'), adminController.addUser);
router.get('/users', authenticateToken, authorizeRoles('SYSTEM_ADMIN'), adminController.getUsers);
router.post('/stores', authenticateToken, authorizeRoles('SYSTEM_ADMIN'), adminController.addStore);
router.get('/stores', authenticateToken, authorizeRoles('SYSTEM_ADMIN'), adminController.getStores);

module.exports = router;