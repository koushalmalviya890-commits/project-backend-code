const express = require("express");
const router = express.Router();

const { chatWithAI } = require("../controllers/chatController");

router.post("/chat", chatWithAI);

module.exports = router;
