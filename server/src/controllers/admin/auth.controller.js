//server/src/controllers/admin/auth.controller.js
const Auth = require('../../models/auth.model');
// utils
const { cmsLogger } = require('../../utils/maintainability/logger.utils');
const ApiResponse = require('../../utils/maintainability/response.utils');
// middleware
const { AppError } = require('../../middlewares/maintainability/error.middleware');

class AuthController {
    static async monitorUser (req, res, next) {
        const start = Date.now();
        try {
            const { filter } = req.body;
            const users = await Auth.getMonitor(filter);
            
            return ApiResponse.success(res, users, 'Users fetched successfully', 200);
        } catch (error) {
            cmsLogger.error('Error during fetch users monitor:', {
                error: error.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }

    static async updateStatus (req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        const { status } = req.body;
        try {
            await Auth.updateStatus(id, status);
            cmsLogger.info('Success update status user', {
                id: id,
                status: status,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'Status di Edited', 200);
        } catch (err) {
            cmsLogger.error('Error Update Status user:', {
                id: id,
                status: status,
                error: err.message,
                duration: Date.now() - start
            });
            return next(new AppError('Server error', 500));
        }
    }
}

module.exports = AuthController;