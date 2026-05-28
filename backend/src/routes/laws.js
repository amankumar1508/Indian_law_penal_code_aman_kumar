const express = require('express');
const { getLaws, getLaw } = require('../controllers/laws');
const { apiLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.use(apiLimiter);
router.route('/').get(getLaws);
router.route('/:id').get(getLaw);

module.exports = router;
