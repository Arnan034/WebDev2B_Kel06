const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const Award = require('../models/award.model');

let authTokenUser;
let userRoleUser;
let authTokenAdmin;
let userRoleAdmin;
let responseCreateAward;

beforeAll(async () => {
    const loginResponseUser = await request(app)
        .post('/api/auth/sign-in')
        .send({
            username: 'users',
            password: 'users'
        });
    authTokenUser = loginResponseUser.body.data.token;
    userRoleUser = loginResponseUser.body.data.role;

    const loginResponseAdmin = await request(app)
        .post('/api/auth/sign-in')
        .send({
            username: 'admin',
            password: 'password'
        });
    authTokenAdmin = loginResponseAdmin.body.data.token;
    userRoleAdmin = loginResponseAdmin.body.data.role;
});

// Public Routes Tests
describe('Award public access GET getInstitutionAward', () => {
    it('should return 200 and the award institutions', async () => {
        const response = await request(app)
            .get('/api/award/get-institution');

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Award fetched successfully');
    });

    it('should return 404 if no awards found', async () => {
        jest.spyOn(Award, 'getInstitution').mockResolvedValue(null);
        
        const response = await request(app)
            .get('/api/award/get-institution');

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one award');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Award, 'getInstitution').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get('/api/award/get-institution');

        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });

        jest.restoreAllMocks();
    });
});

// Auth Routes Tests
describe('Award auth access GET getUnselectedAward', () => {
    it('should return 200 and unselected awards', async () => {
        const response = await request(app)
            .get('/auth/award/get-unselected')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Award fetched successfully');
    });

    it('should return 404 if no unselected awards found', async () => {
        jest.spyOn(Award, 'getUnselected').mockResolvedValue(null);
        
        const response = await request(app)
            .get('/auth/award/get-unselected')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one award unselected');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Award, 'getUnselected').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get('/auth/award/get-unselected')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });

        jest.restoreAllMocks();
    });
});

// Admin Routes Tests
describe('Award admin access GET getAllAward', () => {
    it('should return 200 and all awards', async () => {
        const response = await request(app)
            .get('/admin/award/get-all')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Award fetched successfully');
    });

    it('should return 403 if not admin', async () => {
        const response = await request(app)
            .get('/admin/award/get-all')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Access denied. Admin rights required.');
    });

    it('should return 404 if no awards found', async () => {
        jest.spyOn(Award, 'getAll').mockResolvedValue(null);
        
        const response = await request(app)
            .get('/admin/award/get-all')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one award');
    });
});

describe('Award admin access POST createAward', () => {
    it('should return 200 and create new award', async () => {
        responseCreateAward = await request(app)
            .post('/admin/award/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                institution: 'Test Institution',
                year: 2024,
                name: 'Test Award'
            });

        expect(responseCreateAward.statusCode).toBe(200);
        expect(responseCreateAward.body.data).toBeDefined();
        expect(responseCreateAward.body.message).toBe('Award created successfully');
    });

    it('should return 400 if fields are missing', async () => {
        const response = await request(app)
            .post('/admin/award/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                institution: 'Test Institution',
                year: 2024
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    it('should return 400 if award already exists', async () => {
        const response = await request(app)
            .post('/admin/award/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                institution: 'Test Institution',
                year: 2024,
                name: 'Test Award'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Award already exists');
    });
});

describe('Award admin access PUT updateAward', () => {
    it('should return 200 when award updated successfully', async () => {
        const response = await request(app)
            .put(`/admin/award/update/${responseCreateAward.body.data.id_award}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                institution: 'Updated Institution',
                year: 2025,
                name: 'Updated Award'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Award updated successfully');
    });

    it('should return 400 when fields are missing', async () => {
        const response = await request(app)
            .put(`/admin/award/update/${responseCreateAward.body.data.id_award}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                institution: 'Updated Institution',
                year: 2025
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    it('should return 404 when award not found', async () => {
        const response = await request(app)
            .put('/admin/award/update/0')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                institution: 'Updated Institution',
                year: 2025,
                name: 'Updated Award'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Award not found');
    });
});

describe('Award admin access DELETE deleteAward', () => {
    it('should return 200 and delete the award', async () => {
        const response = await request(app)
            .delete(`/admin/award/delete/${responseCreateAward.body.data.id_award}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Award deleted successfully');
    });

    it('should return 404 when award not found', async () => {
        const response = await request(app)
            .delete('/admin/award/delete/0')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Award not found');
    });
});

afterAll(async () => {
    try {
        if (responseCreateAward) {
            await pool.query('DELETE FROM award WHERE name = $1', ['Test Award']);
        }
        await pool.end();
    } catch (error) {
        console.error('Cleanup error:', error);
        await pool.end();
    }
});
