//server/src/routes/admin/country.route.js
const express = require('express');
const router = express.Router();
const countryController = require('../../controllers/admin/country.controller');

router.post('/create', countryController.createCountry);
router.put('/update/:id', countryController.updateCountry);
router.delete('/delete/:id', countryController.deleteCountry);

module.exports = router;