//server/src/controllers/public/filter.controller.js
const Filter = require('../../models/filter.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class FilterController {
    static async getYears (req, res, next) {
        const start = Date.now();
        try {
            const filter = await Filter.getYears();
            return ApiResponse.success(res, filter, 'Success fetch all year', 200);
        } catch (err) {
            logger.error('Error fetching year:', {
                error: err.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async getAvailabilitys (req, res, next) {
        const start = Date.now();
        try {
            const filter = await Filter.getAvailabilitys();
            return ApiResponse.success(res, filter, 'Success fetch all availability', 200);
        } catch (err) {
            logger.error('Error fetching availability:', {
                error: err.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = FilterController;