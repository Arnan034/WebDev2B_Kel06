const express = require('express');
const router = express.Router();
const { getYears, getAvailabilitys } = require('../controllers/filterController.js');

// Rute untuk genre
router.get('/years', getYears);
router.get('/availability', getAvailabilitys);

module.exports = router;