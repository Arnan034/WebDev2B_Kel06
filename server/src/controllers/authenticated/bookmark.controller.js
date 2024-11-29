const Bookmark = require('../../models/bookmark.model'); // Sesuaikan dengan model yang digunakan
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

class BookmarkController {
    static async getBookmarkFilm (req, res, next) {
        const start = Date.now();
        const { userId } = req.params;
        try {
            const bookmark = await Bookmark.getBookmark(userId);
            if (!bookmark) {
                logger.error('No one bookmark film', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'No one bookmark film', 404);
            }
            logger.info('Bookmark fetched successfully', {
                userId,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, bookmark, 'Bookmark fetched successfully', 200);
        } catch (error) {
            logger.error('Error fetching bookmarks:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async getUserBookmarkFilm (req, res, next) {
        const start = Date.now();
        const { userId, filmId } = req.params;
        try {
            const bookmark = await Bookmark.getUserBookmark(userId, filmId);
            logger.info('Bookmark status fetched successfully', {
                userId, 
                filmId,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, 
                { isBookmarked: !!bookmark }, 
                'Bookmark status fetched successfully', 
                200
            );
        } catch (error) {
            logger.error('Error checking bookmark status:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async createBookmark (req, res, next) {
        const start = Date.now();
        const { userId, filmId } = req.body;
        try {
            await Bookmark.addBookmark(userId, filmId);
            logger.info('Bookmark added successfully', {
                userId, 
                filmId,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'Bookmark added successfully', 201);
        } catch (error) {
            logger.error('Error creating bookmark:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async deleteBookmark (req, res, next) {
        const start = Date.now();
        const { userId, filmId } = req.params;
        
        try {
            const result = await Bookmark.delBookmark(userId, filmId);
            if (!result) {
                logger.error('Bookmark not found', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'Bookmark not found', 404);
            }
            logger.info('Bookmark removed successfully', {
                userId, 
                filmId,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'Bookmark removed successfully', 200);
        } catch (error) {
            logger.error('Error deleting bookmark:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }
};

module.exports = BookmarkController;