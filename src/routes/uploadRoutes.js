const express = require('express');
const router = express.Router();

const {
  createUploadUrl,
  deleteFile,
} = require("../controllers/uploadController.js");

router.post("/", createUploadUrl);
router.delete("/", deleteFile);

module.exports = router;
