//server/src/controllers/public/genre.controller.js
const Genre = require('../../models/genre.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

class GenreController {
    static async getAllGenres (req, res, next) {
        const start = Date.now();
        try {
            const genre = await Genre.getAll();
            if (!genre) {
                logger.error('No one genre', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'No one genre', 404);
            }
            return ApiResponse.success(res, genre, 'Success fetch all genre', 200);
        } catch (error) {
            logger.error('Error fetching all genre:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }
}

module.exports = GenreController;
