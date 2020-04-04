const {
  urlGoogle,
  getGoogleAccountFromCode
} = require("../services/googleAuth");
const User = require("../models/User");
const { generateToken } = require("../services/jwt");

module.exports.googleLoginUrl = (req, res) => {
  res.status(200).json({
    url: urlGoogle()
  });
};

module.exports.googleLogin = async (req, res) => {
  const code = req.query.code;
  const data = await getGoogleAccountFromCode(code);
  if (data.error) {
    return res.status(500).json({ error: data.error });
  }
  let tokenPayload = {
    google_tokens: data.googleTokens
  };
  const existingUser = await User.findOne({ googleID: data.user.googleID });
  if (existingUser) {
    tokenPayload["user"] = {
      id: existingUser.id
    };
    existingUser.online = true;
    await existingUser.save();
  } else {
    const savedUser = await new User({
      ...data.user,
      online: true
    }).save();
    tokenPayload["user"] = {
      id: savedUser.id
    };
  }
  const token = generateToken(tokenPayload);
  return res.status(200).json({ token });
};
