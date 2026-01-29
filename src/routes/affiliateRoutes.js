// import express from 'express';
const { checkAffiliateEmail, setAffiliatePassword, registerStartup, registerServiceProvider } = require('../controllers/affiliateController.js');
const express = require('express');
const router = express.Router();

router.post('/check', checkAffiliateEmail);
router.post('/set-password', setAffiliatePassword);
router.post('/register', registerStartup); 
router.post('/register-service-provider', registerServiceProvider); 

module.exports = router;