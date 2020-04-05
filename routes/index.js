const express = require("express");
const router = express.Router();

router.use("/auth", require("./api/auth"));
router.use("/users", require("./api/users"));
router.use("/slots", require("./api/slots"));

module.exports = router;
