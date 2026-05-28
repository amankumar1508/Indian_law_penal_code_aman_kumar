const express = require('express');
const { getSystemStats, getTopLaws } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All analytics routes require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.route('/stats').get(getSystemStats);
router.route('/top-laws').get(getTopLaws);

module.exports = router;
