const Law = require('../models/Law');

// @desc    Get all laws / Search laws
// @route   GET /api/v1/laws
// @route   GET /api/v1/search
// @access  Public
exports.getLaws = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude from direct matching
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, etc) if needed
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse the query
    query = Law.find(JSON.parse(queryStr));

    // Keyword Search (Full text or regex)
    if (req.query.keyword) {
      query = query.find({
        $or: [
          { section_title: { $regex: req.query.keyword, $options: 'i' } },
          { section_desc: { $regex: req.query.keyword, $options: 'i' } },
          { act: { $regex: req.query.keyword, $options: 'i' } }
        ]
      });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Law.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Execute
    const laws = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({
      success: true,
      count: laws.length,
      pagination,
      data: laws
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single law and increment view count
// @route   GET /api/v1/laws/:id
// @access  Public
exports.getLaw = async (req, res, next) => {
  try {
    const law = await Law.findById(req.params.id);

    if (!law) {
      return res.status(404).json({ success: false, error: 'Law not found' });
    }

    // Increment views safely
    law.views = (law.views || 0) + 1;
    await law.save();

    res.status(200).json({ success: true, data: law });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
