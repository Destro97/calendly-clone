const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/keys");

module.exports.generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: 360000
  });
  return token;
};

module.exports.verifyToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    return decodedToken;
  } catch (err) {
    console.error(`Error decoding token ${token} as ${err}`);
    return false;
  }
};
