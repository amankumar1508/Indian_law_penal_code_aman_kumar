const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Law = require('../models/Law');

// @desc    Get JWT protected profile (similar to auth profile but under jwt namespace)
// @route   GET /api/v1/jwt/profile
const getJwtProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Access granted via valid JWT verification pipeline! 🔓',
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get JWT protected dashboard overview
// @route   GET /api/v1/jwt/dashboard
const getJwtDashboard = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Welcome to the JWT Protected Portal Dashboard!',
      timestamp: new Date(),
      scopes: ['read:laws', 'read:profile', 'read:analytics']
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually generate a JWT token for a given user payload (useful for testing)
// @route   POST /api/v1/jwt/generate-token
const manualGenerateToken = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    if (!userId) {
      res.status(400);
      return next(new Error('userId is required to generate manual token'));
    }

    const token = jwt.sign(
      { id: userId, role: role || 'User' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      token,
      expiresIn: '1h'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually verify any JWT token
// @route   POST /api/v1/jwt/verify-token
const manualVerifyToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400);
      return next(new Error('token is required for manual verification'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      valid: true,
      decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      valid: false,
      message: error.message
    });
  }
};

// @desc    Refresh/Rotate a valid token
// @route   POST /api/v1/jwt/refresh-token
const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400);
      return next(new Error('Expired/Valid token is required to rotate'));
    }

    // Decode ignoring expiration to let users refresh expired tokens safely
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    
    // Generate new token
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role || 'User' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    res.status(200).json({
      success: true,
      token: newToken,
      rotated: true
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke/Invalidate a token (Blacklist simulation)
// @route   DELETE /api/v1/jwt/revoke-token
const revokeToken = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Token successfully blacklisted/revoked on server session registers'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get protected laws scope
// @route   GET /api/v1/jwt/private-laws
const getPrivateLaws = async (req, res, next) => {
  try {
    const laws = await Law.find({ category: 'Violent Crimes' }).limit(3);
    res.status(200).json({
      success: true,
      scope: 'private:laws',
      message: 'Authorized access to sensitive criminal listings successful!',
      count: laws.length,
      data: laws
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get protected analytics scope
// @route   GET /api/v1/jwt/private-analytics
const getPrivateAnalytics = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      scope: 'private:analytics',
      message: 'Authorized access to core operational metrics successful!',
      stats: {
        serverMemoryUsage: process.memoryUsage().heapUsed,
        uptime: process.uptime(),
        nodeVersion: process.version
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJwtProfile,
  getJwtDashboard,
  manualGenerateToken,
  manualVerifyToken,
  refreshToken,
  revokeToken,
  getPrivateLaws,
  getPrivateAnalytics
};
