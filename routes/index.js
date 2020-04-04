const express = require("express");
const router = express.Router();

router.use("/auth", require("./api/auth"));

module.exports = router;
