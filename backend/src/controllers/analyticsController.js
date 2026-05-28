const Law = require('../models/Law');
const User = require('../models/User');

// @desc    Get system metrics and overall stats
// @route   GET /api/v1/analytics/stats
// @access  Private/Admin
exports.getSystemStats = async (req, res, next) => {
  try {
    const totalLaws = await Law.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Calculate total platform views safely using aggregation
    const viewsData = await Law.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalPlatformViews = viewsData.length > 0 ? viewsData[0].totalViews : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLaws,
        totalUsers,
        totalPlatformViews,
        uptime: process.uptime(),
        serverTime: new Date()
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get top 10 most viewed laws
// @route   GET /api/v1/analytics/top-laws
// @access  Private/Admin
exports.getTopLaws = async (req, res, next) => {
  try {
    const topLaws = await Law.find().sort('-views').limit(10);

    res.status(200).json({
      success: true,
      count: topLaws.length,
      data: topLaws
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
