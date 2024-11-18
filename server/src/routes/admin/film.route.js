//server/src/routes/admin/film.route.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const filmController = require('../../controllers/admin/film.controller');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024,
    }
});
router.get('/validate', filmController.getValidateFilms);
router.get('/get-edit/:id', filmController.getEditFilm);
router.put('/update-validate/:id', filmController.updateFilmValidate);
router.put('/save-edit/:id', upload.single('picture'), filmController.saveEditValidate);
router.delete('/delete/:id', filmController.deleteFilm);

module.exports = router;