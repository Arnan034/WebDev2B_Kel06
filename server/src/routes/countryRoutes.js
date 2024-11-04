const express = require('express');
const router = express.Router();
const { getAllCountries, createCountry, updateCountry, deleteCountry } = require('../controllers/countryController');

// Rute untuk negara
router.get('/', getAllCountries);
router.post('/', createCountry);
router.put('/:id', updateCountry);
router.delete('/:id_country', deleteCountry);

module.exports = router;