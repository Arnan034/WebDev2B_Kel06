//server/src/routes/public/country.route.js
const express = require('express');
const router = express.Router();
const countryController = require('../../controllers/public/country.controller');

router.get('/get-all', countryController.getAllCountries);

module.exports = router;