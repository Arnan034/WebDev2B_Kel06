const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAllFilms, getValidateFilms, getFilmById, getFilmSearch, createFilm, updatePlusView, updateFilmValidate, saveEditValidate, deleteFilm, getEditFilm } = require('../controllers/filmController');
const upload = multer({ storage: multer.memoryStorage() });

// Rute untuk Film
router.get('/', getAllFilms);
router.get('/validate', getValidateFilms);
router.get('/search', getFilmSearch);
router.get('/get/:id', getFilmById);
router.get('/get-edit/:id', getEditFilm);
router.post('/', upload.single('picture'), createFilm);
router.post('/increment-view/:id', updatePlusView);
router.put('/validate/:id_film', updateFilmValidate);
router.put('/save-edit/:id_film', upload.single('picture'), saveEditValidate);
router.delete('/:id', deleteFilm);

module.exports = router;
