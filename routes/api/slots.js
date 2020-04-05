const express = require("express");
const router = express.Router();

const { verifyTokenMiddleware } = require("../../middleware/auth");
const { storeUserSlotValidator } = require("../../middleware/users");
const { storeUserSlot } = require("../../controllers/users");

router.post("/", storeUserSlotValidator, verifyTokenMiddleware, storeUserSlot);

module.exports = router;
