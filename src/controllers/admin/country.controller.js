//server/src/controllers/admin/country.controller.js
const Country = require('../../models/country.model');
const ApiResponse = require('../../utils/maintainability/response.utils');
const { cmsLogger } = require('../../utils/maintainability/logger.utils');

class CountryController {
    static async createCountry (req, res, next) {
        const start = Date.now();
        const { country_name } = req.body;
        try {
            if (!country_name || country_name.trim() === '') {
                cmsLogger.error('Country name is required', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Country name is required', 400);
            }

            const existingCountry = await Country.check(country_name);

            if (existingCountry) {
                cmsLogger.error('Country already exists', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Country already exists', 400);
            }

            const newCountry = await Country.create(country_name);
            
            cmsLogger.info('Success create country', {
                country: {id: newCountry.id_country, name: newCountry.country_name},
                duration: Date.now() - start
            });
            return ApiResponse.success(res, newCountry, 'Country created successfully', 201);
        } catch (error) {
            cmsLogger.error('Error creating country:', {
                country: country_name,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async updateCountry (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        const { name } = req.body;
        try {

            if (!id || isNaN(id)) {
                cmsLogger.error('Invalid ID', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Invalid ID', 400);
            }

            if (!name || name.trim() === '') {
                cmsLogger.error('Country name is required', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Country name is required', 400);
            }
    
            if (!await Country.check(id)) {
                cmsLogger.error('Country ID not found', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Country ID not found', 404);
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
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async deleteCountry (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        try {
            const countryExists = await Country.check(id); 
            if (!countryExists) {
                cmsLogger.error('Country not found', {
                    duration: Date.now() - start
                })
                return ApiResponse.error(res, 'Country not found', 404);
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
                return ApiResponse.error(res, 'Cant delete the country because its still the movie being referenced.', 400);
            } else {
                return ApiResponse.serverError(res, 'Server error', error);
            }
        }
    }
};

module.exports = CountryController;