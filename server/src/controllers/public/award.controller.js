//server/src/controllers/public/award.controller.js
const Award = require('../../models/award.model');

//utils
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

class AwardController {
    static async getInstitutionAward (req, res, next) {
        const start = Date.now();
        try {
            const award = await Award.getInstitution();
            if (!award) {
                logger.error('No one award', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'No one award', 404);
            }
            return ApiResponse.success(res, award, 'Award fetched successfully', 200);
        } catch (error) {
            logger.error('Error fetching award institution:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }
}

module.exports = AwardController;