const { check } = require("express-validator");

module.exports.storeUserSlotValidator = [
  check("month", "Month is required").not().isEmpty(),
  check("date", "Date is required").not().isEmpty(),
  check("start", "Start time of slot(s) is required").not().isEmpty(),
  check("end", "End time of slot(s) is required").not().isEmpty()
];
