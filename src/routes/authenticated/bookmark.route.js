//server/src/routes/authenticated/bookmark.route.js
const express = require('express');
const router = express.Router();
const bookmarkController = require('../../controllers/authenticated/bookmark.controller');

// Rute untuk bookmark
router.get('/get-bookmark/:userId', bookmarkController.getBookmarkFilm);
router.get('/get-user-bookmark/:userId/:filmId', bookmarkController.getUserBookmarkFilm);
router.post('/create', bookmarkController.createBookmark);
router.delete('/delete/:userId/:filmId', bookmarkController.deleteBookmark);

module.exports = router;