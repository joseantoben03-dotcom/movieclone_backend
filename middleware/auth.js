// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization; // "Bearer <token>"
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // { userId, email, iat, exp }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
