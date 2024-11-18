const express = require('express');
const router = express.Router();
const genreController = require('../../controllers/public/genre.controller');

router.get('/get-all', genreController.getAllGenres);

module.exports = router;