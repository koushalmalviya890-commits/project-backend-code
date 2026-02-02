const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // Import Protect

const { checkUserController } = require("../controllers/checkUserController");
router.post("/checkuser", protect, checkUserController);

module.exports = router;
