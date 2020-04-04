const { verifyToken } = require("../services/jwt");
const User = require("../models/User");

module.exports.verifyTokenMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "No token found" });
  }
  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return res.status(401).json({ error: "Invalid Token" });
  }
  const userId = decodedToken.user.id;
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(401).json({
        error: "User not authenticated"
      });
    }
    if (!user.online) {
      return res.status(401).json({
        error: "User not logged in"
      });
    }
    req.user = user;
    req.google_tokens = decodedToken.google_tokens;
    next();
  } catch (err) {
    console.error(err);
    if (err.kind == "ObjectId") {
      return res.status(400).json({
        message: "Resource not found"
      });
    }
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};
