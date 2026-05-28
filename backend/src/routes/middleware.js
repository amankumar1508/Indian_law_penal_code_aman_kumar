const express = require('express');
const {
  practiceLogger,
  practiceAuth,
  practiceCache,
  practiceRateLimit,
  practiceErrorHandler,
  practiceRequestTime,
  practiceSecurity,
  practiceCors,
  practiceCompression,
  practiceValidation
} = require('../controllers/middlewareController');

const router = express.Router();

router.get('/logger', practiceLogger);
router.get('/auth', practiceAuth);
router.get('/cache', practiceCache);
router.get('/rate-limit', practiceRateLimit);
router.get('/error-handler', practiceErrorHandler);
router.get('/request-time', practiceRequestTime);
router.get('/security', practiceSecurity);
router.get('/cors', practiceCors);
router.get('/compression', practiceCompression);
router.post('/validation', practiceValidation);

module.exports = router;
