//server/src/controllers/admin/actor.controller.js
const Actor = require('../../models/actor.model');
const pool = require('../../config/db');
// utils
const ApiResponse = require('../../utils/maintainability/response.utils');
const {cmsLogger} = require('../../utils/maintainability/logger.utils');
const {convertBase64ToBuffer, bufferImage} = require('../../utils/security/image.utils');

class ActorController {
    static async createActor(req, res, next) {
        const start = Date.now();
        const { country, name, birth_date, picture } = req.body;
        if (!country || !name || !birth_date || !picture) {
            return ApiResponse.error(res, 'All fields are required', 400);
        }
        try {
            const checkActor = await Actor.check(name);
            if (checkActor) {
                return ApiResponse.error(res, 'Actor already exists', 400);
            }

            const pictureBuffer = convertBase64ToBuffer(picture);
            const newActor = await Actor.create(country, name, birth_date, pictureBuffer);
            
            if (!newActor) {
                return ApiResponse.error(res, 'Failed to create actor', 400);
            }
            
            cmsLogger.info('Success Create actor', {
                actor: {
                    id: newActor.id_actor, 
                    name: newActor.name, 
                    country: newActor.country, 
                    birth_date: newActor.birth_date
                },
                duration: Date.now() - start
            });

            return ApiResponse.success(res, newActor, 'Actor created successfully', 201);
        } catch (error) {
            cmsLogger.error('Error creating actor:', {
                actor: {name, country, birth_date},
                error: error.message, 
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', 500);
        }
    }

    static async updateActor(req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        const { country, name, birth_date, picture } = req.body;
        if (!country || !name || !birth_date || !picture) {
            return ApiResponse.error(res, 'All fields are required', 400);
        }
        try {
            const checkActor = await Actor.check(id);

            if (!checkActor) {
                return ApiResponse.error(res, 'Actor not found', 404);
            }

            // Track changes
            const changes = [];
            if (name !== checkActor.name) {
                changes.push(`name: ${checkActor.name} -> ${name}`);
            }
            if (country !== checkActor.country) {
                changes.push(`country: ${checkActor.country} -> ${country}`);
            }
            if (birth_date !== checkActor.birth_date) {
                changes.push(`birth_date: ${checkActor.birth_date} -> ${birth_date}`);
            }
            if (picture ) {
                changes.push('picture: updated');
            }

            let pictureBuffer;
            if (picture) {
                if (picture.startsWith('data:image')) {
                    pictureBuffer = convertBase64ToBuffer(picture);
                } else {
                    pictureBuffer = bufferImage(picture);
                }
            }

            const updatedActor = await Actor.update(id, country, name, birth_date, pictureBuffer);
            if (!updatedActor) {
                return ApiResponse.error(res, 'Failed to update actor', 400);
            }

            cmsLogger.info('Actor updated', {
                actorId: id,
                changes: changes,
                duration: Date.now() - start
            });

            return ApiResponse.success(res, updatedActor, 'Actor updated successfully');
        } catch (error) {
            cmsLogger.error('Error to update actor', {
                actorId: id,
                attemptedChanges: {
                    name: name,
                    country: country,
                    birth_date: birth_date
                },
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', 500);
        }
    }

    static async deleteActor(req, res, next) {
        const start = Date.now();
        const { id } = req.params;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await Actor.deleteActor(client, id);
            const deletedActor = await Actor.delete(client, id);
            
            if (!deletedActor) {
                await client.query('ROLLBACK');
                return ApiResponse.error(res, 'Actor not found', 404);
            }
            
            await client.query('COMMIT');
            cmsLogger.info('Success Delete actor', {
                actor: {
                    id: deletedActor.id_actor, 
                    name: deletedActor.name,
                    country: deletedActor.country,
                    birth_date: deletedActor.birth_date
                },
                duration: Date.now() - start
            });
            return ApiResponse.success(res, deletedActor, 'Actor deleted successfully');
        } catch (error) {
            await client.query('ROLLBACK');
            cmsLogger.error('Error deleting actor:', {
                actorId: id,
                error: error.message, 
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', 500);
        } finally {
            client.release();
        }
    }
}

module.exports = ActorController;
