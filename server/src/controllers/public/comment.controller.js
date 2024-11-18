//server/src/controllers/public/comment.controller.js
const Comment = require('../../models/comment.model');

//utils
const ApiResponse = require('../../utils/maintainability/response.utils');  
const { logger } = require('../../utils/maintainability/logger.utils');

//middleware
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class CommentController {
    static async getCommentByIdFilm (req, res, next) {
        const start = Date.now();
        try {
            const { id_film } = req.params;
            const { filter } = req.query;

            const comment = await Comment.findByIdFilm(id_film, filter);
            return ApiResponse.success(res, comment, 'Comment fetched successfully', 200);
        } catch (error) {
            logger.error('Error Comment 02: ', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = CommentController;