const express = require('express');
const router = express.Router();

const { getMapEmbed } = require("../controllers/MapController");

router.get("/", getMapEmbed);

module.exports = router;