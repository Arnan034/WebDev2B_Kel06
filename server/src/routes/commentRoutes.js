const express = require('express');
const router = express.Router();
const { getAllComments, getCommentByIdFilm, createComment, updateApproveComment, deleteComment } = require('../controllers/commentController');

// Rute untuk komentar
router.get('/all', getAllComments);
router.get('/byFilm/:id', getCommentByIdFilm);
router.post('/create/:userId/:filmId', createComment);
router.put('/updateApprove', updateApproveComment);
router.delete('/delete', deleteComment);

module.exports = router;