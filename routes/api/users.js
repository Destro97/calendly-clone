const express = require("express");
const router = express.Router();

const { verifyTokenMiddleware } = require("../../middleware/auth");
const {
  storeUserSlotValidator,
  bookSlotValidator
} = require("../../middleware/users");
const {
  fetchAllUsers,
  storeUserSlot,
  fetchUserSlots,
  bookSlot
} = require("../../controllers/users");

router.get("/", fetchAllUsers);

router.post(
  "/:id/slots",
  storeUserSlotValidator,
  verifyTokenMiddleware,
  storeUserSlot
);

router.get("/:id/slots", verifyTokenMiddleware, fetchUserSlots);

router.post(
  "/:id/slots/:slotId/book",
  bookSlotValidator,
  verifyTokenMiddleware,
  bookSlot
);

module.exports = router;
