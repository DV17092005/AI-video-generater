const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const subscriptionCheck = require("../middleware/subscriptionCheck");
const {
  generate
} = require("../controllers/videoController");

router.post("/generate", protect, subscriptionCheck, generate);

module.exports = router;