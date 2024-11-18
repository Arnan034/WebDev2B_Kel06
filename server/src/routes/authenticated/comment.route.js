//server/src/routes/authenticated/comment.route.js
const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/authenticated/comment.controller');
const { createCommentLimiter } = require('../../middlewares/security/rateLimiter.middleware');


router.post('/create/:userId/:filmId', createCommentLimiter, commentController.createComment);

module.exports = router;