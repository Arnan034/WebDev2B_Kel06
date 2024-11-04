const express = require('express');
const router = express.Router();
const { getBookmarkFilm, getUserBookmarkFilm, createBookmark, deleteBookmark } = require('../controllers/bookmarkController');

// Rute untuk bookmark
router.get('/film/:userId', getBookmarkFilm);
router.get('/get/:userId/:filmId', getUserBookmarkFilm);
router.post('/post/', createBookmark);
router.delete('/del/:userId/:filmId', deleteBookmark);

module.exports = router;