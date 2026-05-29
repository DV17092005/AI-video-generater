const express = require("express");
const router = express.Router();

const {
  list
} = require("../controllers/userController");

router.get("/", list);

module.exports = router;