const express = require('express');
const router = express.Router();
const { getAllFilms, getFilmById, getFilmSearch, createFilm, updatePlusView, updateFilm, deleteFilm } = require('../controllers/filmController');

// Rute untuk Film
router.get('/', getAllFilms);
router.get('/search', getFilmSearch);
router.get('/get/:id', getFilmById);
router.post('/', createFilm);
router.post('/increment-view/:id', updatePlusView)
router.put('/:id', updateFilm);
router.delete('/:id', deleteFilm);

module.exports = router;
