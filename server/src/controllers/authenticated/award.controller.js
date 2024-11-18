//server/src/controllers/authenticated/award.controller.js
const Award = require('../../models/award.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class AwardController {
    static async getUnselectedAward (req, res, next) {
        const start = Date.now();
        try {
            const award = await Award.getUnselected();
            return ApiResponse.success(res, award, 'Award fetched successfully', 200);
        } catch (err) {
            logger.error('Error fetching movies:', {
                error: err.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        } 
    }
}

module.exports = AwardController;