const express = require("express");
const router = express.Router();

const { verifyTokenMiddleware } = require("../../middleware/auth");
const { storeUserSlotValidator } = require("../../middleware/users");
const {
  fetchAllUsers,
  storeUserSlot,
  fetchUserSlots
} = require("../../controllers/users");

router.get("/", fetchAllUsers);

router.post(
  "/:id/slots",
  storeUserSlotValidator,
  verifyTokenMiddleware,
  storeUserSlot
);

router.get("/:id/slots", verifyTokenMiddleware, fetchUserSlots);

module.exports = router;
