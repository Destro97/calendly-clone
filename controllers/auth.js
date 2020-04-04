const { urlGoogle } = require("../services/googleAuth");

module.exports.googleLoginUrl = (req, res) => {
  res.status(200).json({
    url: urlGoogle(),
  });
};
