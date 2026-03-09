const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied: No token provided" });

  try {
    const defaultSecret = "fallbacksecret_change_me_later";
    const verified = jwt.verify(token, process.env.JWT_SECRET || defaultSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }
    next();
  });
};

module.exports = { authMiddleware, adminMiddleware };
