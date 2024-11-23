//server/src/controllers/public/actor.controller.js
const Actor = require('../../models/actor.model');
const Film = require('../../models/film.model');
//utils
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

class ActorController {
    static async getActorByIdFilm(req, res) {
        const start = Date.now();
        const { id_film } = req.params;
        
        try {
            const checkFilm = await Film.checkFilm(id_film);

            if (!checkFilm) {
                return ApiResponse.error(res, 'Film not found', 404);
            }
            
            const actors = await Actor.getByIdFilm(id_film);
            
            if (!actors || actors.length === 0) {
                return ApiResponse.error(res, 'No actors found for this film', 404);
            }
            
            return ApiResponse.success(res, actors, 'Film actors retrieved successfully', 200);
        } catch (error) {
            // Log error untuk tracking
            logger.error('Error fetching film actors:', {
                id_film,
                error: error.message,
                duration: Date.now() - start
            });

            // Langsung kirim response server error
            return ApiResponse.serverError(
                res, 
                'Error fetching film actors', 
                error
            );
        }
    }

    static async getActorById(req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        try {
            const actor = await Actor.getById(id);
            
            if (!actor) {
                return ApiResponse.error(res, 'Actor not found', 404);
            }
            
            return ApiResponse.success(res, actor, 'Actor retrieved successfully');
        } catch (error) {
            logger.error('Error fetching actor:', {
                id: id,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Error fetching actor', error);
        }
    }
}

module.exports = ActorController;