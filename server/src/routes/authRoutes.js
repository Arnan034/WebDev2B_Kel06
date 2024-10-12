// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateLogin = require('../middlewares/validateLogin');

router.post('/signin', validateLogin, authController.signin);

module.exports = router;
