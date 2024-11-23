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
            if (!filter) {
                return ApiResponse.error(res, 'No one year', 404);
            }
            return ApiResponse.success(res, filter, 'Success fetch all year', 200);
        } catch (error) {
            logger.error('Error fetching year:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async getAvailabilitys (req, res, next) {
        const start = Date.now();
        try {
            const filter = await Filter.getAvailabilitys();
            if (!filter) {
                return ApiResponse.error(res, 'No one availability', 404);
            }
            return ApiResponse.success(res, filter, 'Success fetch all availability', 200);
        } catch (error) {
            logger.error('Error fetching availability:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }
}

module.exports = FilterController;