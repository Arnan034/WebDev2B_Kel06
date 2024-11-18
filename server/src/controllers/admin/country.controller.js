//server/src/controllers/admin/country.controller.js
const Country = require('../../models/country.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { cmsLogger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class CountryController {
    static async createCountry (req, res, next) {
        const start = Date.now();
        try {
            const { country_name } = req.body;

            const existingCountry = await Country.check(country_name);

            if (existingCountry) {
                return next(new AppError('Country already exists', 400));
            }

            const newCountry = await Country.create(country_name);
            cmsLogger.info('Success create country', {
                country: {id: newCountry.id_country, name: newCountry.country_name},
                duration: Date.now() - start
            });
            return ApiResponse.success(res, {country_name: newCountry.country_name}, 'Country created successfully', 201);
        } catch (error) {
            cmsLogger.error('Error creating country:', {
                country: country_name,
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async updateCountry (req, res, next) {
        const start = Date.now();
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!id || isNaN(id)) {
                return next(new AppError('Invalid ID', 400));
            }

            if (!name) {
                return next(new AppError('Country name is required', 400));
            }
    
            if (!await Country.check(id)) {
                return next(new AppError('Country ID not found', 404));
            }

            const country = await Country.update(id, name);
            cmsLogger.info('Success update country', {
                country: {id: id, name: name},
                duration: Date.now() - start
            });
            return ApiResponse.success(res, country, 'Country updated successfully', 200);
        } catch (error) {
            cmsLogger.error('Error updating country:', {
                country: {id: id, name: name},
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async deleteCountry (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        try {
            console.log(id);
            const countryExists = await Country.check(id); 
            if (!countryExists) {
                return next(new AppError('Country not found', 404));
            }

            const deletedCountry = await Country.delete(id); 
            cmsLogger.info('Success delete country', {
                country: {id: deletedCountry.id_country, name: deletedCountry.country_name},
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, `Country "${deletedCountry.country_name}" deleted successfully!`, 200);
        } catch (error) {
            cmsLogger.error('Error deleting country:', {
                country: {id: id},
                error: error.message,
                duration: Date.now() - start
            });
            if (error.code === '23503') {
                return next(new AppError('Cant delete the country because its still the movie being referenced.', 400));
            } else {
                return next(new AppError('Server error', 500));
            }
        }
    }
};

module.exports = CountryController;