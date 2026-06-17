const express = require('express');
const { register, login, getMe, googleLogin, getBookmarks, toggleBookmark, addToHistory, getHistory, clearHistory } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimiter');
const { validateBody } = require('../middlewares/validation');

const router = express.Router();

router.post('/register', authLimiter, validateBody(['name', 'email', 'password']), register);
router.post('/login', authLimiter, validateBody(['email', 'password']), login);
router.post('/google', authLimiter, validateBody(['token']), googleLogin);
router.get('/me', protect, getMe);
router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks/:id', protect, toggleBookmark);
router.post('/history/:id', protect, addToHistory);
router.get('/history', protect, getHistory);
router.delete('/history', protect, clearHistory);

module.exports = router;
