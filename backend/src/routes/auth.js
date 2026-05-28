const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const { validateBody } = require('../middlewares/validation');

const router = express.Router();

router.post('/register', authLimiter, validateBody(['name', 'email', 'password']), register);
router.post('/login', authLimiter, validateBody(['email', 'password']), login);
router.get('/me', protect, getMe);

module.exports = router;
