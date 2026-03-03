// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function auth(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token'); // Common header name for tokens

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user from payload
        req.user = decoded.user; // req.user will now contain { id: userId, username: username, role: userRole, isVerified: isVerified }
        next(); // Move to the next middleware/route handler
    } catch (e) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

// Middleware to check user role
function authorizeRoles(...roles) {
    return (req, res, next) => {
        // Check if req.user exists (from auth middleware) and has a role
        if (!req.user || !req.user.role) {
            return res.status(403).json({ msg: 'Access denied, no role provided' });
        }

        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: `Access denied, role ${req.user.role} is not authorized` });
        }
        next(); // User is authorized, proceed
    };
}

module.exports = { auth, authorizeRoles };
