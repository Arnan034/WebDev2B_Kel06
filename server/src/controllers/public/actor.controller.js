//server/src/controllers/public/actor.controller.js
const Actor = require('../../models/actor.model');

//utils
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

//middleware
const { AppError } = require('../../middlewares/maintainability/error.middleware');


class ActorController {
    static async getActorByIdFilm(req, res, next) {
        const start = Date.now();
        const { id_film } = req.params;
        try {
            const actors = await Actor.getByIdFilm(id_film);
            
            if (!actors) {
                return next(new AppError('No actors found for this film', 404));
            }
            
            return ApiResponse.success(res, actors, 'Film actors retrieved successfully');
        } catch (error) {
            logger.error('Error fetching film actors:', {
                id_film: id_film,
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async getActorById(req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        try {
            const actor = await Actor.getById(id);
            
            if (!actor) {
                return next(new AppError('Actor not found', 404));
            }
            
            return ApiResponse.success(res, actor, 'Actor retrieved successfully');
        } catch (error) {
            logger.error('Error fetching actor:', {
                id: id,
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = ActorController;