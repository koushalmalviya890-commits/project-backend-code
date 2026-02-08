// import express from 'express';
const express = require('express');
const router = express.Router();
const { checkAffiliateEmail,
    setAffiliatePassword,
    registerStartup,
    registerServiceProvider,
    calculateAffiliatePrice,
    createAffiliateUser,
    trackAffiliateVisitor,
    trackAffiliateCustomer,
    calculateAffiliatePriceDetail,
    createAffiliateOrder,
    retryAffiliatePayment,
    verifyAffiliatePayment } = require('../controllers/affiliateController.js');

const { sendInvoiceEmailEndpoint } = require('../controllers/affiliateInvoiceController.js')


router.post('/check', checkAffiliateEmail);
//router.post('/pricing/calculate', calculateAffiliatePrice);
router.post('/set-password', setAffiliatePassword);
router.post('/register', registerStartup);
router.post('/register-service-provider', registerServiceProvider);



router.post('/user', createAffiliateUser);
router.post('/user/visitors', trackAffiliateVisitor);
router.post("/user/customers", trackAffiliateCustomer);
router.post('/user/pricing', calculateAffiliatePrice);
router.post("/user/pricing-detail-page", calculateAffiliatePriceDetail)
router.post("/user/payments/order", createAffiliateOrder)
router.post("user/payments/retry", retryAffiliatePayment)
router.post("/user/payments/verify", verifyAffiliatePayment)
router.post("/user/invoices/email", sendInvoiceEmailEndpoint)



module.exports = router;