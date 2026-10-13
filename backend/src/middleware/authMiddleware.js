const jwt = require('jsonwebtoken');

// Verify JWT Bearer Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No authentication token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123', (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired authentication token.' });
    }
    req.user = decodedUser;
    next();
  });
};

// Role Authorization Middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. You do not have permission to perform this action.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};