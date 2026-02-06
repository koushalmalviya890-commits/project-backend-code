const express = require("express");
const router = express.Router();
const { subscribeNewsletter } = require("../controllers/newsletterController");

router.post("/", subscribeNewsletter);

module.exports = router;
