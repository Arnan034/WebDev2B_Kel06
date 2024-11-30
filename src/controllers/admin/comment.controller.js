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
            if (!comments) {
                cmsLogger.error('No one comments', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'No one comments', 404);
            }
            return ApiResponse.success(res, comments, 'Comments fetched successfully', 200);
        } catch (error) {
            cmsLogger.error("Error get all comments: ", {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', 500);
        }
    }

    static async updateApproveComment (req, res, next) {
        const start = Date.now();
        const { ids } = req.body;
        try {
            if (!ids) {
                cmsLogger.error('ID list is required', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'ID list is required', 400);
            }

            if (Array.isArray(ids) && ids.length > 0) {
                const updateApprove = ids.map(id => Comment.approveComment(id));
                const results = await Promise.all(updateApprove);
                
                if (results.some(result => result === null)) {
                    cmsLogger.error('One or more comments not found', {
                        duration: Date.now() - start
                    });
                    return ApiResponse.error(res, 'One or more comments not found', 404);
                }
            } else {
                cmsLogger.error('Invalid or empty ID list.', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'Invalid or empty ID list.', 400);
            }

            cmsLogger.info('Success update approve comment', {
                id: ids,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'Update approve comment successfully', 200);
        } catch (error) {
            cmsLogger.error("Error update approve comment: ", {
                id: ids,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', 500);
        }
    }

    static async deleteComment (req, res, next) {
        const start = Date.now();
        const { ids } = req.body;
        try {
            if (!ids) {
                cmsLogger.error('ID list is required', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'ID list is required', 400);
            }

            if (Array.isArray(ids) && ids.length > 0) {
                const deleteResults = await Promise.all(
                    ids.map(id => Comment.deleteComment(id))
                );
                if (deleteResults.some(result => result === null)) {
                    cmsLogger.error('One or more comments not found', {
                        duration: Date.now() - start
                    });
                    return ApiResponse.error(res, 'One or more comments not found', 404);
                }
            } else {
                cmsLogger.error('Invalid or empty ID list.', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'Invalid or empty ID list.', 400);
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
            return ApiResponse.serverError(res, 'Server error', 500);
        }
    }
}

module.exports = CommentController;