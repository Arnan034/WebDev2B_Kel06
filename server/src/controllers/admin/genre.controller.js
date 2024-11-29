//server/src/controllers/admin/genre.controller.js
const pool = require('../../config/db');
const Genre = require('../../models/genre.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { cmsLogger } = require('../../utils/maintainability/logger.utils');

class GenreController {

    static async createGenre (req, res, next) {
        const start = Date.now();
        const { genre } = req.body;
        try {
            const genreExists = await Genre.check(genre);

            if (genreExists) {
                cmsLogger.error('Genre already exists', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Genre already exists', 400);
            }
    
            const newGenre = await Genre.create(genre);
            cmsLogger.info('Success create genre', {
                genre: {id: newGenre.id_genre, name: newGenre.genre},
                duration: Date.now() - start
            });
            return ApiResponse.success(res, newGenre, 'Success', 201);
        } catch (error) {
            cmsLogger.error('Error creating genre:', {
                genre: genre,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async updateGenre (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        const { name } = req.body;
        try {
        
            if (!id || isNaN(id)) {
                cmsLogger.error('Invalid ID', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Invalid ID', 400);
            }
            if (!name) {
                cmsLogger.error('Genre name is required', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Genre name is required', 400);
            }
            const genreExists = await Genre.check(id);

            if (!genreExists) {
                cmsLogger.error('Genre ID not found', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Genre ID not found', 404);
            }

            const changes = [];
            if (name !== genreExists.genre) {
                changes.push(`name: ${genreExists.genre} -> ${name}`);
            }

            const genre = await Genre.update(id, name);
            if (!genre) {
                return ApiResponse.error(res, 'Failed to update genre', 400);
            }
            
            cmsLogger.info('Success update genre', {
                genreId: genre.id_genre,
                changes: changes,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, genre, 'Success', 200);
        } catch (error) {
            cmsLogger.error('Error updating genre:', {
                genre: {id: id, name: name},
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async deleteGenre (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        const client = await pool.connect();
        console.log(id);
        try {
            await client.query('BEGIN');
            const genreExists = await Genre.check(id); 

            if (!genreExists) {
                cmsLogger.error('Genre not found', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Genre not found', 404);
            }

            await Genre.deleteGenre(client, id);
            const deletedGenre = await Genre.delete(client, id);
            
            await client.query('COMMIT');
            cmsLogger.info('Success delete genre', {
                genreId: id,
                genreName: deletedGenre.genre,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, `Genre ${deletedGenre.genre} deleted successfully!`, 200);
        } catch (error) {
            await client.query('ROLLBACK'); 
            cmsLogger.error('Error deleting genre:', {
                genreId: id,
                error: error.message,
                duration: Date.now() - start
            });
            if (error.code === '23503') {
                return ApiResponse.error(res, 'Cannot delete genre as it is still referenced in other tables.', 400);
            } else {
                return ApiResponse.serverError(res, 'Server error', error);
            }
        } finally {
            client.release();
        }
    }
}

module.exports = GenreController;