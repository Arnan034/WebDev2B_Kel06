//server/src/controllers/public/film.controller.js
const Film = require('../../models/film.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

class FilmController {
    static async getAllFilms (req, res, next) {
        const start = Date.now();
        try {
            const { country, sort, year, availability, genre, award, status } = req.query;
            const film = await Film.getAll(country, sort, year, availability, genre, award, status);
            if (!film) {
                return ApiResponse.error(res, 'No one film found', 404);
            }
            return ApiResponse.success(res, film, 'Success get all films', 200);
        } catch (error) {
            logger.error('Error fetching all movies:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async getFilmSearch (req, res, next) {
        const start = Date.now();
        try {
            const { search, sort, country, year, availability, genre, award, status } = req.query;
            const films = await Film.getBySearch(search, sort, country, year, availability, genre, award, status);
            if (!films || films.length === 0) {
                return ApiResponse.error(res, 'No one search film found', 404);
            }
            return ApiResponse.success(res, films, 'Success get films by search', 200);
        } catch (error) {
            logger.error('Error fetching search movies:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async getFilmById (req, res, next) {
        const start = Date.now();
        try {
            const { id } = req.params;

            const film = await Film.getById(id);
            if (!film) {
                return ApiResponse.error(res, 'Film not found', 404);
            }
            return ApiResponse.success(res, film, 'Success', 200);
        } catch (error) {
            logger.error('Error fetching movies detail:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async updatePlusView (req, res, next) {
        const start = Date.now();
        try {
            const { id } = req.params;
            
            // Cek film dulu
            const checkFilm = await Film.getById(id);
            if (!checkFilm) {
                return ApiResponse.error(res, 'Film not found', 404);
            }

            await Film.plusView(id);
            return ApiResponse.success(res, null, 'View incremented successfully', 200);
        } catch (error) {
            logger.error('Error View Increment:', {
                error: error.message,
                duration: Date.now() - start
            });
        return ApiResponse.serverError(res, 'Server error', error);
        }
    }
}

module.exports = FilmController;

