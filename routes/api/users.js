const express = require("express");
const router = express.Router();

const { verifyTokenMiddleware } = require("../../middleware/auth");
const { bookSlotValidator } = require("../../middleware/users");
const {
  fetchAllUsers,
  fetchUserSlots,
  bookSlot
} = require("../../controllers/users");

router.get("/", fetchAllUsers);

router.get("/:id/slots", verifyTokenMiddleware, fetchUserSlots);

router.post(
  "/:id/slots/:slotId/book",
  bookSlotValidator,
  verifyTokenMiddleware,
  bookSlot
);

module.exports = router;
