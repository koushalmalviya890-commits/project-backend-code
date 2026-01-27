const express = require("express");
const router = express.Router();

const { checkUserController } = require("../controllers/checkUserController");

router.post("/checkuser", checkUserController);

module.exports = router;
