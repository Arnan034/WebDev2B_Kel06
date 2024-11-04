// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateLogin = require('../middlewares/validateLogin');

router.post('/signin', validateLogin, authController.signin);
router.post('/signupOTP', authController.signupOTP);
router.post('/verifyOTP', authController.verifyOTP);
router.post('/resendOTP', authController.resendOTP);
router.post('/googleSignin', authController.signGoogle);
router.post('/getUserMonitoring', authController.monitorUser);
router.post('/forget-password', authController.forgetPassword);
router.put('/updateStatus/:id', authController.updateStatus);
router.put('/reset-password', authController.resetPassword);

module.exports = router;
