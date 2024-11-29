//server/src/controllers/public/comment.controller.js
const Comment = require('../../models/comment.model');

//utils
const ApiResponse = require('../../utils/maintainability/response.utils');  
const { logger } = require('../../utils/maintainability/logger.utils');

class CommentController {
    static async getCommentByIdFilm (req, res, next) {
        const start = Date.now();
        try {
            const { id_film } = req.params;
            const { filter } = req.query;

            const comment = await Comment.findByIdFilm(id_film, filter);
            if (!comment) {
                logger.error('No one comment in this film', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'No one comment in this film', 404);
            }
            return ApiResponse.success(res, comment, 'Comment fetched successfully', 200);
        } catch (error) {
            logger.error('Error Comment 02: ', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }
}

module.exports = CommentController;