const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const subscriptionCheck = require("../middleware/subscriptionCheck");
const {
  generate
} = require("../controllers/videoController");

router.post("/generate", protect, subscriptionCheck, generate);

// Temporary test route to enqueue video generation without auth/subscription checks.
// Remove this in production after debugging.
router.post("/generate/test", generate);

module.exports = router;