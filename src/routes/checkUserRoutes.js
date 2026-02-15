const express = require("express");
const router = express.Router();
const { optionalProtect } = require("../middleware/authMiddleware"); 

const { checkUserController } = require("../controllers/checkUserController");
router.post("/checkuser", optionalProtect, checkUserController);

module.exports = router;
