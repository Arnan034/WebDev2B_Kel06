//server/src/controllers/authenticated/actor.controller.js
const Actor = require('../../models/actor.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

class ActorController {
    static async getAllActor(req, res, next) {
        const start = Date.now();
        try {
            const actors = await Actor.getAll();
            
            if (!actors || actors.length === 0) {
                return ApiResponse.error(res, 'No actors found', 404);
            }
            return ApiResponse.success(res, actors, 'Actors retrieved successfully', 200);
        } catch (error) {
            logger.error('Error fetching actors:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, error.message, {
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = ActorController;
