const express = require("express");

const router = express.Router();

const {
  getMyPortal,
} = require("../controllers/clientPortalController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  clientOnly,
} = require("../middleware/roleMiddleware");

router.get(
  "/me",
  protect,
  clientOnly,
  getMyPortal
);

module.exports = router;