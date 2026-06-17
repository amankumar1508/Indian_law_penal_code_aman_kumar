const User = require('../models/User');
const Law = require('../models/Law');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ success: false, error: 'Your account has been banned' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Google Login
// @route   POST /api/v1/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'No token provided' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
    });
    
    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // random password for google users
        role: 'User'
      });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, error: 'Your account has been banned' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: 'Google login failed: ' + err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Toggle bookmark
// @route   POST /api/v1/auth/bookmarks/:id
// @access  Private
exports.toggleBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const lawId = req.params.id;
    
    const isBookmarked = user.bookmarks.includes(lawId);
    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== lawId.toString());
    } else {
      user.bookmarks.push(lawId);
    }
    
    await user.save();
    
    res.status(200).json({ success: true, data: user.bookmarks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get bookmarked laws
// @route   GET /api/v1/auth/bookmarks
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    res.status(200).json({ success: true, data: user.bookmarks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add law to history
// @route   POST /api/v1/auth/history/:id
// @access  Private
exports.addToHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    const lawId = req.params.id;
    
    // Initialize history if undefined (for older users)
    if (!user.history) user.history = [];
    
    // Remove if already in history to move to top
    user.history = user.history.filter(item => item.law && item.law.toString() !== lawId.toString());
    
    // Add to history
    user.history.unshift({ law: lawId, viewedAt: Date.now() });
    
    // Keep max 50 items
    if (user.history.length > 50) {
      user.history.pop();
    }
    
    await user.save();
    
    res.status(200).json({ success: true, data: user.history });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get user history
// @route   GET /api/v1/auth/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('history.law');
    res.status(200).json({ success: true, data: user.history });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Clear user history
// @route   DELETE /api/v1/auth/history
// @access  Private
exports.clearHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.history = [];
    await user.save();
    res.status(200).json({ success: true, data: [] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get token from model and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token
  });
};
