const express = require('express');
const router = express.Router();
const { getAllComments, getCommentByIdFilm, createComment, updateComment, deleteComment } = require('../controllers/commentController');

// Rute untuk komentar
router.get('/', getAllComments);
router.get('/:id', getCommentByIdFilm);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;