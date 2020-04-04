const express = require("express");

const { googleLoginUrl, googleLogin } = require("../../controllers/auth");

const router = express.Router();

router.get("/google", googleLoginUrl);

router.get("/google/callback", googleLogin);

module.exports = router;
