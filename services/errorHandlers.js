const { validationResult } = require("express-validator");

module.exports.errorHandler = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsArray = errors.array();
    const firstError = errorsArray[0].msg;
    return firstError;
  } else {
    return false;
  }
};
