const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/keys");

module.exports.generateToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: 360000
  });
  return token;
};
