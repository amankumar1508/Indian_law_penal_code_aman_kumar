const express = require('express');
const {
  getJwtProfile,
  getJwtDashboard,
  manualGenerateToken,
  manualVerifyToken,
  refreshToken,
  revokeToken,
  getPrivateLaws,
  getPrivateAnalytics
} = require('../controllers/jwtController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/generate', manualGenerateToken);
router.post('/verify', manualVerifyToken);
router.post('/refresh', protect, refreshToken);
router.post('/revoke', protect, revokeToken);

router.get('/profile', protect, getJwtProfile);
router.get('/dashboard', protect, getJwtDashboard);
router.get('/laws', protect, getPrivateLaws);
router.get('/analytics', protect, getPrivateAnalytics);

module.exports = router;
