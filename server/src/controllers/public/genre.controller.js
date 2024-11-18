//server/src/controllers/public/genre.controller.js
const Genre = require('../../models/genre.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class GenreController {
    static async getAllGenres (req, res, next) {
        const start = Date.now();
        try {
            const genre = await Genre.getAll();
            return ApiResponse.success(res, genre, 'Success fetch all genre', 200);
        } catch (err) {
            logger.error('Error fetching all genre:', {
                error: err.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = GenreController;
