const express = require('express');
const router = express.Router();
const { register, login, approveUser } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// User registration and login routes
router.post('/register', register);
router.post('/login', login);

// Admin route to approve users
router.patch('/approve/:userId', protect, authorizeRoles('admin'), approveUser);

module.exports = router;
