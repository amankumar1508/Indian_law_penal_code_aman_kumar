// In-memory simple cache buffer for demonstration/practice route
const memoryCache = {};

// @desc    Practice logging middleware
// @route   GET /api/v1/middleware/logger
const practiceLogger = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logging middleware triggered successfully!',
    details: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    }
  });
};

// @desc    Practice auth middleware verification
// @route   GET /api/v1/middleware/auth
const practiceAuth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth middleware verify succeeded! You are authorized.',
    user: req.user
  });
};

// @desc    Practice cache middleware
// @route   GET /api/v1/middleware/cache
const practiceCache = (req, res) => {
  const cacheKey = 'global-practice-key';
  
  if (memoryCache[cacheKey]) {
    return res.status(200).json({
      success: true,
      source: 'Cache Buffer memory storage',
      message: 'Cached response returned successfully!',
      data: memoryCache[cacheKey]
    });
  }

  const freshData = {
    cachedAt: new Date(),
    valuableInfo: 'This data was calculated at a high CPU cost!'
  };

  memoryCache[cacheKey] = freshData;

  res.status(200).json({
    success: true,
    source: 'Fresh Database calculations',
    message: 'Cached registered for subsequent requests!',
    data: freshData
  });
};

// @desc    Practice rate limiting thresholds
// @route   GET /api/v1/middleware/rate-limit
const practiceRateLimit = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rate limiting check passed! IP is currently within thresholds.'
  });
};

// @desc    Practice centralized error bubble triggers
// @route   GET /api/v1/middleware/error-handler
const practiceErrorHandler = (req, res, next) => {
  // Deliberately throw an error to test the bubble catch block
  res.status(400);
  next(new Error('This is a simulated bubble error, caught by our global error handler middleware!'));
};

// @desc    Practice request timing header injections
// @route   GET /api/v1/middleware/request-time
const practiceRequestTime = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Timing metrics checked successfully!',
    requestReceivedTimestamp: new Date(),
    serverTickTime: Date.now()
  });
};

// @desc    Practice security headers (Helmet metrics check)
// @route   GET /api/v1/middleware/security
const practiceSecurity = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Helmet security header checking completed! High-security headers present.',
    headersChecked: [
      'X-DNS-Prefetch-Control',
      'X-Frame-Options',
      'Strict-Transport-Security',
      'X-Download-Options',
      'X-Content-Type-Options'
    ]
  });
};

// @desc    Practice CORS origins validation
// @route   GET /api/v1/middleware/cors
const practiceCors = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS cross-origin access allowed successfully!',
    accessControlAllowOrigin: req.headers.origin || '*'
  });
};

// @desc    Practice Gzip compression mocks
// @route   GET /api/v1/middleware/compression
const practiceCompression = (req, res) => {
  // Simulate heavy response payload
  const heavyArray = Array.from({ length: 1000 }).map((_, i) => ({
    id: i,
    fill: 'Heavy repeating padding bytes to trigger compression algorithms'
  }));

  res.status(200).json({
    success: true,
    message: 'Large content compression practice triggered!',
    uncompressedBytesSize: JSON.stringify(heavyArray).length,
    data: heavyArray
  });
};

// @desc    Practice validation body guards
// @route   POST /api/v1/middleware/validation
const practiceValidation = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Validation guard passed perfectly! Request body is completely schema compliant.'
  });
};

module.exports = {
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
};
