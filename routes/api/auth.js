const express = require("express");

const { verifyTokenMiddleware } = require("../../middleware/auth");
const {
  googleLoginUrl,
  googleLogin,
  logout
} = require("../../controllers/auth");

const router = express.Router();

router.get("/google", googleLoginUrl);

router.get("/google/callback", googleLogin);

router.get("/logout", verifyTokenMiddleware, logout);

module.exports = router;
