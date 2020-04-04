const express = require("express");

const { googleLoginUrl } = require("../../controllers/auth");

const router = express.Router();

router.get("/google", googleLoginUrl);

module.exports = router;
