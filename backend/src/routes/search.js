const express = require('express');
const { getLaws } = require('../controllers/laws');
const { apiLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.use(apiLimiter);

// Alias search route mapping to the main laws controller
router.get('/:keyword', (req, res, next) => {
  req.query.keyword = req.params.keyword;
  getLaws(req, res, next);
});

module.exports = router;
