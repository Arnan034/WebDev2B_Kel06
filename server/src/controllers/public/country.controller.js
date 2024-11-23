//server/src/controllers/public/country.controller.js
const Country = require('../../models/country.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { logger } = require('../../utils/maintainability/logger.utils');

class CountryController {
    static async getAllCountries (req, res) {
        const start = Date.now();
        try {
            const country = await Country.getAll();
            if (!country) {
                return ApiResponse.error(res, 'No one country', 404);
            }
            return ApiResponse.success(res, country, 'Country fetched successfully', 200);
        } catch (error) {
            logger.error('Error Fetch All Country:', {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }
}

module.exports = CountryController;
