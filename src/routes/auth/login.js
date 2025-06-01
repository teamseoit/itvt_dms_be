const express = require('express');
const router = express.Router();
const authController = require("../../controllers/auth/controller");
const verifyAccessToken = require('../../middleware/verifyAccessToken');

router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/logout', verifyAccessToken, authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;