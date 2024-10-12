const express = require('express');
const router = express.Router();
const { getAllAward, createAward, updateAward, deleteAward } = require('../controllers/genreController.js');

// Rute untuk genre
router.get('/', getAllAward);
router.post('/', createAward);
router.put('/:id', updateAward);
router.delete('/:id', deleteAward);

module.exports = router;