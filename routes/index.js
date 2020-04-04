const express = require("express");
const router = express.Router();

router.use("/auth", require("./api/auth"));
router.use("/users", require("./api/users"));

module.exports = router;
