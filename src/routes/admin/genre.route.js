//server/src/routes/admin/genre.route.js
const express = require('express');
const router = express.Router();
const genreController = require('../../controllers/admin/genre.controller');

router.post('/create', genreController.createGenre);
router.put('/update/:id', genreController.updateGenre);
router.delete('/delete/:id', genreController.deleteGenre);

module.exports = router;