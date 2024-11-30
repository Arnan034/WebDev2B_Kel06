const express = require('express');
const router = express.Router();
const filterController = require('../../controllers/public/filter.controller');

// Rute untuk genre
router.get('/years', filterController.getYears);
router.get('/availability', filterController.getAvailabilitys);

module.exports = router;