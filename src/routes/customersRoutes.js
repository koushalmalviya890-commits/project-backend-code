const express = require("express");
const router = express.Router();

const { getCustomers } = require("../controllers/customersController");

router.get("/customers/:providerUserId", getCustomers);

module.exports = router;
