//server/src/controllers/admin/film.controller.js
const pool = require('../../config/db');
const Film = require('../../models/film.model');
const Award = require('../../models/award.model');
const Genre = require('../../models/genre.model');
const Actor = require('../../models/actor.model');
const Comment = require('../../models/comment.model');
// utils
const ApiResponse = require('../../utils/maintainability/response.utils');
const { cmsLogger } = require('../../utils/maintainability/logger.utils');
const { convertBase64ToBuffer, bufferImage } = require('../../utils/security/image.utils');


class FilmController {
    static async getValidateFilms (req, res, next) {
        const start = Date.now();
        try {
            const { filter } = req.query;
            const film = await Film.getAllValidate(filter);
            if (!film) {
                return ApiResponse.error(res, 'No films found validate', 404);
            }
            return ApiResponse.success(res, film, 'Fetch Validate Film Success', 200);
        } catch (error) {
            cmsLogger.error('Error fetching Validate movies:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', 500);
        }
    }

    static async getEditFilm (req, res, next) {
        const start = Date.now();
        const client = await pool.connect();
        const { id } = req.params;
        try {            
            const filmDetails = await Film.getFilmEdit(client, id);
        
            if (!filmDetails) {
                return ApiResponse.error(res, 'Film not found', 404);
            }

            await Award.updateAwardFilm(client , id);
        
            await client.query('COMMIT');
            return ApiResponse.success(res, filmDetails, 'Fetch Edit Film Success', 200);
        } catch (error) {
            await client.query('ROLLBACK');
            cmsLogger.error('Error Fetch Edit Film:', {
                filmId: id,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', 500);
        } finally {
            client.release();
        }
    }

    static async updateFilmValidate (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        try {
            const updateValidate = await Film.updateValidate(id);
            if (!updateValidate) {
                return ApiResponse.error(res, 'Failed to update film validate', 400);
            }
            cmsLogger.info('Success update film validate', {
                filmId: id,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'Film di Approve', 200);
        } catch (error) {
            cmsLogger.error('Error Update Film:', {
                filmId: id,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', 500);
        }
    }

    static async saveEditValidate (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        const {
            title,
            picture,
            alt_title,
            year,
            country,
            synopsis,
            link_trailer,
            availability,
            status,
            award,
            genre,
            actor,
        } = req.body;

        if (!title || !picture ||!alt_title || !year || !country || !synopsis || !link_trailer || !availability || !status) {
            return ApiResponse.error(res, 'All fields are required', 400);
        }

        const parsedAward = JSON.parse(award);
        const parsedGenre = JSON.parse(genre || '[]');
        const parsedActor = req.body['actor[]'] ? [JSON.parse(req.body['actor[]'])] : [];

        let pictureBuffer; 
        if (picture.startsWith('data:image')) {
            pictureBuffer = convertBase64ToBuffer(picture);
        } else {
            pictureBuffer = bufferImage(picture);
        }
    
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
    
            await Actor.deleteActorFilm(client, id);
    
            await Genre.deleteGenreFilm(client, id);

            const updateEditFilm = await Film.updateEditFilm(client, id, title, pictureBuffer, alt_title, year, country, synopsis, link_trailer, availability, status);
            if (!updateEditFilm) {
                return ApiResponse.error(res, 'Failed to update film', 400);
            }
    
            // Simpan penghargaan
            if (parsedAward.length > 0) {
                for (const award of parsedAward) {
                    await Award.updatefilm(client, award.value, id);
                }
            }

            // Insert new genres
            if (parsedGenre.length > 0) {
                for (const id_genre of parsedGenre) {
                    await Genre.addGenreFilm(client, id_genre.id, id);
                }
            }
            
            // Insert new actors
            if (parsedActor.length > 0) {
                for (const actor of parsedActor) {
                    await Actor.addActorFilm(client, actor.id, actor.cast, id);
                }
            }

            // Commit the transaction
            await client.query('COMMIT');
            cmsLogger.info('Success save edit validate', {
                filmId: id,
                title: title,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'Film berhasil Save', 201);
        } catch (error) {
            await client.query('ROLLBACK');
            cmsLogger.error('Error during edit validate:', {
                filmId: id,
                title: title,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Terjadi kesalahan saat membuat film', 500);
        } finally {
            client.release();
        }
    }

    static async deleteFilm (req, res) {
        const start = Date.now();
        const client = await pool.connect();
        const { id } = req.params;
        try{
            await client.query('BEGIN');
            
            await Award.updateAwardFilm(client, id);
            
            await Actor.deleteActorFilm(client, id);

            await Genre.deleteGenreFilm(client, id);

            await Comment.deleteCommentFilm(client, id);
            
            const deleteFilm = await Film.delete(client, id);
            
            await client.query('COMMIT');
            cmsLogger.info('Success delete film', {
                filmId: id,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, deleteFilm, 'Film deleted successfully', 200);
        } catch (error) {
            await client.query('ROLLBACK');
            cmsLogger.error('Error Delete Film:', {
                filmId: id,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        } finally {
            client.release();
        }
    }

};

module.exports = FilmController;