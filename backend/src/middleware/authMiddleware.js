const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    // 1. Get the token from the request header
    // It usually looks like: "Bearer eyJhbGciOiJIUzI1NiIsInR5..."
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify the token using your secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach the user's data (id, role) to the request so the next function can use it
    req.user = verified;

    // 4. Move to the actual route handler
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

// Optional: A quick extra middleware if you want to restrict routes to staff/admin only later
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };