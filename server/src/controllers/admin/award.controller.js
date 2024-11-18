//server/src/controllers/admin/award.controller.js
const Award = require('../../models/award.model'); // Sesuaikan dengan model yang digunakan
const ApiResponse = require('../../utils/maintainability/response.utils');
const { cmsLogger } = require('../../utils/maintainability/logger.utils');
const { AppError } = require('../../middlewares/maintainability/error.middleware');


class AwardController {
    static async getAllAward (req, res, next) {
        const start = Date.now();
        try {
            const award = await Award.getAll();

            return ApiResponse.success(res, award, 'Award fetched successfully', 200);
        } catch (err) {
            cmsLogger.error('Error get all award:', {
                error: err.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async createAward (req, res, next) {
        const start = Date.now();
        const { institution, year, name } = req.body;
        try {
            const existingAward = await Award.check(institution, year, name);
    
            if (existingAward) {
                return next(new AppError('Award already exists', 400));
            }

            const newAward = await Award.create(institution, year, name);
            cmsLogger.info('Success create award', {
                award: {
                    id: newAward.id_award,
                    institution: newAward.institution,
                    year: newAward.year,
                    name: newAward.name
                },
                duration: Date.now() - start
            });
            return ApiResponse.success(res, newAward, 'Award created successfully', 200);
        } catch (err) {
            cmsLogger.error('Error creating award:', {
                award: {
                    institution: institution,
                    year: year,
                    name: name
                },
                error: err.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async updateAward (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        const { institution, year, name } = req.body;
        console.log(id, institution, year, name);
        try {
            if (!institution || !year || !name) {
                return next(new AppError('All fields are required', 400));
            }

            const existingAward = await Award.checkId(id);
            if (!existingAward) {
                return next(new AppError('Award not found', 404));
            }

            const changes = [];
            if (name !== existingAward.name) {
                changes.push(`name: ${existingAward.name} -> ${name}`);
            }
            if (institution !== existingAward.institution) {
                changes.push(`institution: ${existingAward.institution} -> ${institution}`);
            }
            if (year !== existingAward.year) {
                changes.push(`year: ${existingAward.year} -> ${year}`);
            }

            const updatedAward = await Award.update(id, institution, year, name);
            
            cmsLogger.info('Success update award', {
                awardId: id,
                changes: changes,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, updatedAward, 'Award updated successfully', 200);
        } catch (error) {
            cmsLogger.error('Error updating award:', {
                awardId: id,
                attemptedChanges: {
                    institution: institution,
                    year: year,
                    name: name
                },
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async deleteAward (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        try {
            const deletedAward = await Award.delete(id);
            if (!deletedAward) {
                return next(new AppError('Award not found', 404));
            }
            cmsLogger.info('Success delete award', {
                awardId: id,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, deletedAward, 'Award deleted successfully', 200);
        } catch (error) {
            cmsLogger.error('Error deleting award:', {
                awardId: id,
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = AwardController;