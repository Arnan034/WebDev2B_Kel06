//server/src/controllers/public/film.controller.js
const Film = require('../../models/film.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class FilmController {
    static async getAllFilms (req, res, next) {
        const start = Date.now();
        try {
            const { country, sort, year, availability, genre, award, status } = req.query;
            const film = await Film.getAll(country, sort, year, availability, genre, award, status);
            return ApiResponse.success(res, film, 'Success', 200);
        } catch (error) {
            logger.error('Error fetching all movies:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async getFilmSearch (req, res, next) {
        const start = Date.now();
        try {
            const { search, sort, country, year, availability, genre, award, status } = req.query;
            const films = await Film.getBySearch(search, sort, country, year, availability, genre, award, status);
            return ApiResponse.success(res, films, 'Success', 200);
        } catch (error) {
            logger.error('Error fetching search movies:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async getFilmById (req, res, next) {
        const start = Date.now();
        try {
            const { id } = req.params;

            const film = await Film.getById(id);
            return ApiResponse.success(res, film, 'Success', 200);
        } catch (error) {
            logger.error('Error fetching movies detail:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async updatePlusView (req, res, next) {
        const start = Date.now();
        try {
            const { id } = req.params;
            await Film.plusView(id);
            return ApiResponse.success(res, null, 'View incremented successfully', 200);
        } catch (error) {
            logger.error('Error View Increment:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = FilmController;

