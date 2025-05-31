const express = require('express');
const router = express.Router();
const authController = require("../../controllers/auth/controller");
const verifyAccessToken = require('../../middleware/verifyAccessToken');

router.post('/login', authController.login);
router.post('/logout', verifyAccessToken, authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;