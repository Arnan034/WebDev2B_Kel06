//server/src/controllers/admin/comment.controller.js
const Comment = require('../../models/comment.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { cmsLogger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class CommentController {
    static async getAllComments (req, res, next) {
        const start = Date.now();
        try {
            const { filter } = req.query;

            const comments = await Comment.findAll(filter);
            return ApiResponse.success(res, comments, 'Comments fetched successfully', 200);
        } catch (error) {
            cmsLogger.error("Error get all comments: ", {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async updateApproveComment (req, res, next) {
        const start = Date.now();
        const { ids } = req.body;
        try {
            if (Array.isArray(ids) && ids.length > 0) {
                const updateApprove = ids.map(id => Comment.approveComment(id));
                await Promise.all(updateApprove); 
            } else {
                return next(new AppError('Invalid or empty ID list.', 400));
            }
            cmsLogger.info('Success update approve comment', {
                id: ids,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'Comments approved successfully.', 200);
        } catch (error) {
            cmsLogger.error("Error update approve comment: ", {
                id: ids,
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async deleteComment (req, res, next) {
        const start = Date.now();
        const { ids } = req.body;
        console.log(ids);
        try {

            if (Array.isArray(ids) && ids.length > 0) {
                const deleteComment = ids.map(id => Comment.deleteComment(id));
                await Promise.all(deleteComment);
            } else {
                return next(new AppError('Invalid or empty ID list.', 400));
            }
            cmsLogger.info('Success delete comment', {
                id: ids,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'Delete Comment successfully.', 200);
        } catch (error) {
            cmsLogger.error("Error delete comment: ", {
                id: ids,
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = CommentController;