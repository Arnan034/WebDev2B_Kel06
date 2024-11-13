const express = require('express');
const router = express.Router();
const { getAllGenres, getGenreById, createGenre, updateGenre, deleteGenre } = require('../controllers/genreController.js');

// Rute untuk genre
router.get('/', getAllGenres);
router.get('/:id', getGenreById);
router.post('/', createGenre);
router.put('/:id', updateGenre);
router.delete('/:id_genre', deleteGenre);

module.exports = router;