// import express from 'express';
const express = require('express');
const router = express.Router();
const { checkAffiliateEmail, setAffiliatePassword, registerStartup, registerServiceProvider, calculateAffiliatePrice } = require('../controllers/affiliateController.js');


router.post('/check', checkAffiliateEmail);
router.post('/pricing/calculate', calculateAffiliatePrice);
router.post('/set-password', setAffiliatePassword);
router.post('/register', registerStartup); 
router.post('/register-service-provider', registerServiceProvider); 

module.exports = router;