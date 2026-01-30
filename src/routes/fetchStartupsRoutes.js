const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  getCustomers,
  addCustomer,
  removeCustomer,
} = require("../controllers/fetchStartupsController");

router.get("/", protect, getCustomers);
router.post("/", protect, addCustomer);
router.delete("/", protect, removeCustomer);

module.exports = router;
