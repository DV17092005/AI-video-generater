const express = require("express");
const router = express.Router();

const {
  create,
  list
} = require("../controllers/projectController");

router.get("/", list);
router.post("/", create);

module.exports = router;
