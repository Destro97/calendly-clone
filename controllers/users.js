const User = require("../models/User");

module.exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0)
      return res.status(404).json({
        message: "No users found"
      });
    return res.status(200).json({ users });
  } catch (err) {
    console.error(`Error occured while finding all users as ${err}`);
    return res.status(500).json({
      message: "internal server error"
    });
  }
};
