//server/src/routes/authenticated/film.route.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const filmController = require('../../controllers/authenticated/film.controller');
const upload = multer({ storage: multer.memoryStorage() });
// const { createFilmLimiter } = require('../../middlewares/security/rateLimiter.middleware');

router.post('/create', upload.single('picture'), filmController.createFilm);

module.exports = router;