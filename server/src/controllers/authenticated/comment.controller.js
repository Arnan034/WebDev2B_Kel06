//server/src/controllers/authenticated/comment.controller.js
const Comment = require('../../models/comment.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class CommentController {
    static async createComment (req, res, next) {
        const start = Date.now();
        try {
            const { userId, filmId } = req.params;
            const { rating, review } = req.body;
        
            await Comment.create( userId, filmId, rating, review)
            return ApiResponse.success(res, null, "Comment created", 201);
        } catch (error) {
            logger.error("Error Comment 03: ", {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = CommentController;