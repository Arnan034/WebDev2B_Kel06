const Bookmark = require('../../models/bookmark.model'); // Sesuaikan dengan model yang digunakan
const ApiResponse = require('../../utils/maintainability/response.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');
const { logger } = require('../../utils/maintainability/logger.utils');

class BookmarkController {
    static async getBookmarkFilm (req, res, next) {
        const start = Date.now();
        const { userId } = req.params;
        try {
            const bookmark = await Bookmark.getBookmark(userId);
            return ApiResponse.success(res, bookmark, 'Bookmark fetched successfully', 200);
        } catch (error) {
            logger.error('Error fetching bookmarks:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Failed to fetch bookmarks', 500));
        }
    }

    static async getUserBookmarkFilm (req, res, next) {
        const start = Date.now();
        const { userId, filmId } = req.params;
        try {
            const bookmark = await Bookmark.getUserBookmark(userId, filmId);
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
            return next(new AppError('Failed to check bookmark status', 500));
        }
    }

    static async createBookmark (req, res, next) {
        const start = Date.now();
        const { userId, filmId } = req.body;
        
        try {

            await Bookmark.addBookmark(userId, filmId);
            return ApiResponse.success(res, null, 'Bookmark added successfully', 201);
        } catch (error) {
            logger.error('Error creating bookmark:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Failed to create bookmark', 500));
        }
    }

    static async deleteBookmark (req, res, next) {
        const start = Date.now();
        const { userId, filmId } = req.params;
        
        try {
            const result = await Bookmark.delBookmark(userId, filmId);
            if (!result) {
                return next(new AppError('Bookmark not found', 404));
            }
            return ApiResponse.success(res, null, 'Bookmark removed successfully', 200);
        } catch (error) {
            logger.error('Error deleting bookmark:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Failed to delete bookmark', 500));
        }
    }
};

module.exports = BookmarkController;