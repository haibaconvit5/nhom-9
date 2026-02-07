const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
