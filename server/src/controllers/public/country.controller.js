//server/src/controllers/public/country.controller.js
const Country = require('../../models/country.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class CountryController {
    static async getAllCountries (req, res, next) {
        const start = Date.now();
        try {
            const country = await Country.getAll();
            
            return ApiResponse.success(res, country, 'Country fetched successfully', 200);
        } catch (err) {
            logger.error('Error Fetch All Country:', {
                error: err.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = CountryController;
