// import express from 'express';
// import { login, getMe, logout } from '../controllers/authController';
const { protect } = require('../middleware/authMiddleware');
const { login, getMe, logout, updateUserType, completeProfile, requestPasswordReset, handleDirectPasswordReset, updatePassword} = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);
router.post('/update-user-type', protect, updateUserType);
router.post('/complete-profile', protect, completeProfile);
router.post('/reset-password', requestPasswordReset);
router.post('/reset-password-direct', handleDirectPasswordReset);
router.post('/update-password', updatePassword);
module.exports = router;