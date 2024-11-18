//server/src/controllers/authenticated/actor.controller.js
const Actor = require('../../models/actor.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class ActorController {
    static async getAllActor(req, res, next) {
        const start = Date.now();
        try {
            const actors = await Actor.getAll();
            return ApiResponse.success(res, actors, 'Actors retrieved successfully');
        } catch (error) {
            logger.error('Error fetching actors:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = ActorController;
