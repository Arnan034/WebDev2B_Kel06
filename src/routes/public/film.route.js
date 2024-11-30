//server/src/routes/public/film.route.js
const express = require('express');
const router = express.Router();
const filmController = require('../../controllers/public/film.controller');


router.get('/get-all', filmController.getAllFilms);
router.get('/search', filmController.getFilmSearch);
router.get('/get-by-id/:id', filmController.getFilmById);
router.post('/increment-view/:id', filmController.updatePlusView);

module.exports = router;
