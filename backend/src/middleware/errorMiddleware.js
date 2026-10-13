// Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err.message || err);

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;