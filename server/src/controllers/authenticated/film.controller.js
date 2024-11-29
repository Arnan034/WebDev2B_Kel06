//server/src/controllers/authenticated/film.controller.js
const pool = require('../../config/db');
const Film = require('../../models/film.model');
const Award = require('../../models/award.model');
const Genre = require('../../models/genre.model');
const Actor = require('../../models/actor.model');
// utils
const ApiResponse = require('../../utils/maintainability/response.utils');
const { cmsLogger } = require('../../utils/maintainability/logger.utils');

class FilmController {
    static async createFilm (req, res) {
        const start = Date.now();
        const {
            title,
            alt_title,
            year,
            country,
            synopsis,
            link_trailer,
            availability,
            status,
            posted_by,
            award,
            genre,
            actor,
        } = req.body;
    
        if (!req.file) {
            cmsLogger.error('image is required', {
                duration: Date.now() - start
            })
            return ApiResponse.error(res, 'image is required', 400);
        }
        if (!title || !alt_title || !year || !country || !synopsis || !link_trailer || !availability || !status || !posted_by) {
            cmsLogger.error('All fields are required', {
                duration: Date.now() - start
            })
            return ApiResponse.error(res, 'All fields are required', 400);
        }

        const parsedAward = JSON.parse(award);
        const parsedGenre = JSON.parse(genre);
        const parsedActor = actor ? actor.map(actorStr => JSON.parse(actorStr)) : [] ;
        
        const pictureBuffer = req.file.buffer;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const film_id = await Film.create(
                title,
                pictureBuffer,
                alt_title,
                year,
                country,
                synopsis,
                link_trailer,
                availability,
                status,
                posted_by
            );
            
            const operations = [];
    
            if (parsedAward && parsedAward.length > 0) {
                const awardPromises = parsedAward.map(({ value }) => {
                    return Award.updatefilm(client, value, film_id);
                });
                operations.push(...awardPromises);
            }

            // Simpan genre
            if (parsedGenre && parsedGenre.length > 0) {
                const genrePromises = parsedGenre.map(id_genre => {
                    return Genre.addGenreFilm(client, id_genre.id, film_id);
                });
                operations.push(...genrePromises);
            }
            
            // Simpan aktor
            if (parsedActor && parsedActor.length > 0) {
                const actorPromises = parsedActor.map(actor => {
                    return Actor.addActorFilm(client, actor.id, actor.cast, film_id);
                });
                operations.push(...actorPromises);
            }
            
            // Tunggu semua operasi selesai
            await Promise.all(operations);
    
            await client.query('COMMIT');

            cmsLogger.info('Success Create film', {
                id: film_id.id_film, 
                title: film_id.title, 
                by: film_id.posted_by, 
                duration: Date.now() - start
            });

            return ApiResponse.success(res, {id_film: film_id}, 'Film berhasil dibuat', 201);
        } catch (error) {
            await client.query('ROLLBACK');
            cmsLogger.error('Error Create film:', {
                title: title, 
                by: posted_by, 
                error: error.message, 
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        } finally {
            client.release();
        }
    }
}

module.exports = FilmController;
