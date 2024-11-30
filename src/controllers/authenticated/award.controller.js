//server/src/controllers/authenticated/award.controller.js
const Award = require('../../models/award.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

class AwardController {
    static async getUnselectedAward (req, res, next) {
        const start = Date.now();
        try {
            const award = await Award.getUnselected();
            if (!award) {
                logger.error('No one award unselected', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'No one award unselected', 404);
            }
            return ApiResponse.success(res, award, 'Award fetched successfully', 200);
        } catch (error) {
            logger.error('Error fetching movies:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        } 
    }
}

module.exports = AwardController;