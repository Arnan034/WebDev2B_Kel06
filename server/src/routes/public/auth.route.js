//server/src/routes/public/auth.route.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/public/auth.controller');
const { validateSignin, validateSignup } = require('../../middlewares/security/validateAuth.middleware');
const { resendOTPLimiter } = require('../../middlewares/security/rateLimiter.middleware');
const { authRequestLogger } = require('../../middlewares/maintainability/logger.middleware');
const { authenticateToken } = require('../../middlewares/security/auth.middleware');

router.post('/sign-in', authRequestLogger, validateSignin, authController.signin);
router.post('/sign-out', authenticateToken, authRequestLogger, authController.logout);
router.post('/sign-up', validateSignup, authController.signup);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', resendOTPLimiter, authController.resendOTP);
router.post('/google-sign-in', authController.signGoogle);
router.post('/forget-password', authController.forgetPassword);
router.put('/reset-password', authController.resetPassword);

module.exports = router;
