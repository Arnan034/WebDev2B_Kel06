//server/src/controllers/authenticated/comment.controller.js
const Comment = require('../../models/comment.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

class CommentController {
    static async createComment (req, res, next) {
        const start = Date.now();
        try {
            const { userId, filmId } = req.params;
            const { rating, review } = req.body;
            if (!rating || !review) {
                return ApiResponse.error(res, 'Rating and review are required', 400);
            }

            if (rating < 1 || rating > 5) {
                return ApiResponse.error(res, 'Rating must be between 1 and 5', 400);
            }
        
            const comment = await Comment.create( userId, filmId, rating, review)
            return ApiResponse.success(res, comment, "Comment created", 201);
        } catch (error) {
            logger.error("Error Comment 03: ", {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }
}

module.exports = CommentController;