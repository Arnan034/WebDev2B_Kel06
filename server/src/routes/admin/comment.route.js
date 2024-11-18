//server/src/routes/admin/comment.route.js
const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/admin/comment.controller.js');

router.get('/get-all', commentController.getAllComments);
router.put('/update-approve', commentController.updateApproveComment);
router.delete('/delete', commentController.deleteComment);

module.exports = router;