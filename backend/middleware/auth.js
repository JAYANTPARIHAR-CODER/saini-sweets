const jwt = require('jsonwebtoken');

// This middleware runs BEFORE protected routes
// It checks if the request has a valid token
const protect = (req, res, next) => {
    let token;

    // Token comes in the header like:
    // Authorization: Bearer eyJhbGci...
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
        
        try {
            // Extract token from "Bearer TOKEN"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token is real and not expired
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user info to request
            req.user = decoded;

            // Move to the next function (the route)
            next();

        } catch (error) {
            return res.status(401).json({ error: "Not authorized, invalid token!" });
        }
    }

    if (!token) {
        return res.status(401).json({ error: "Not authorized, no token!" });
    }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // is admin → allow
    } else {
        res.status(403).json({ error: "Admin access only!" });
    }
};

module.exports = { protect, adminOnly };
