// A simple custom validation middleware for required fields
exports.validateBody = (requiredFields) => {
  return (req, res, next) => {
    const missing = [];
    
    requiredFields.forEach(field => {
      if (!req.body[field]) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Please provide all required fields: ${missing.join(', ')}`
      });
    }
    
    next();
  };
};
