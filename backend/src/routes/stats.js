const express = require('express');
const { getSystemStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Stats is a dedicated alias for the analytics controller
router.use(protect);
router.use(authorize('Admin'));
router.route('/').get(getSystemStats);

module.exports = router;
