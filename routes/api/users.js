const express = require("express");
const router = express.Router();

const { fetchAllUsers } = require("../../controllers/users");

router.get("/", fetchAllUsers);

module.exports = router;
