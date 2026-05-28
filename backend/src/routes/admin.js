const express = require('express');
const { getUsers, toggleBanStatus, changeRole } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All admin routes are protected and require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.route('/users').get(getUsers);
router.route('/users/:id/ban').put(toggleBanStatus);
router.route('/users/:id/role').put(changeRole);

module.exports = router;
