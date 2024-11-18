//server/src/controllers/public/award.controller.js
const Award = require('../../models/award.model');

//utils
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

//middleware
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class AwardController {
    static async getInstitutionAward (req, res, next) {
        const start = Date.now();
        try {
            const award = await Award.getInstitution();
            return ApiResponse.success(res, award, 'Award fetched successfully', 200);
        } catch (error) {
            logger.error('Error fetching award institution:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = AwardController;