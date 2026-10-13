const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// 1. User Store Discovery Route (Normal Users)
router.get(
  '/user-list',
  authenticateToken,
  authorizeRoles('NORMAL_USER'),
  storeController.getStoresForUser
);

// 2. Store Owner Dashboard Route
router.get(
  '/owner-dashboard',
  authenticateToken,
  authorizeRoles('STORE_OWNER'),
  storeController.getOwnerDashboard
);

module.exports = router;