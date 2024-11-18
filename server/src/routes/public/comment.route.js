//server/src/routes/public/comment.route.js
const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/public/comment.controller');

router.get('/get-by-film/:id_film', commentController.getCommentByIdFilm);

module.exports = router;