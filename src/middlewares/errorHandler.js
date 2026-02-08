const errorHandler = (err, req, res, next) => {
  // Handle duplicate key errors (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists. Please use a different ${field}.`;
    
    return res.status(400).json({
      success: false,
      error: { message, field }
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      success: false,
      error: { message }
    });
  }

  // Handle Multer file size limit
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: { message: 'File too large' }
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: { message: err.message || 'Server Error' }
  });
};

module.exports = errorHandler;
