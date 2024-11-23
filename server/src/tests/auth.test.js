const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const Auth = require('../models/auth.model');

let authTokenUser;
let userRoleUser;
let authTokenAdmin;
let userRoleAdmin;
let responseCreateUser;

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
describe('Auth public access POST signin', () => {
    it('should return 200 and token when credentials are valid', async () => {
        const response = await request(app)
            .post('/api/auth/sign-in')
            .send({
                username: 'users',
                password: 'users'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.data.token).toBeDefined();
        expect(response.body.message).toBe('Sign-in successful');
    });

    it('should return 404 when user not found', async () => {
        const response = await request(app)
            .post('/api/auth/sign-in')
            .send({
                username: 'nonexistent',
                password: 'password'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should return 400 when password is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/sign-in')
            .send({
                username: 'users',
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid Password');
    });
});

describe('Auth public access POST signup', () => {
    it('should return 200 and send OTP when registration is successful', async () => {
        responseCreateUser = await request(app)
            .post('/api/auth/sign-up')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
            });

        expect(responseCreateUser.statusCode).toBe(200);
        expect(responseCreateUser.body.data.token).toBeDefined();
        expect(responseCreateUser.body.message).toBe('OTP sent successfully');
    });

    it('should return 422 when username already exists', async () => {
        const response = await request(app)
            .post('/api/auth/sign-up')
            .send({
                username: 'users',
                email: 'another@example.com',
                password: 'password123',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
            });

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Username already registered');
    });

    it('should return 422 when email already registered and verified', async () => {
        jest.spyOn(Auth, 'checkEmail').mockResolvedValue({ is_verified: true });
        
        const response = await request(app)
            .post('/api/auth/sign-up')
            .send({
                username: 'newuser',
                email: 'test@example.com',
                password: 'password123',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
            });

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('Email already registered');
    });
});

// Admin Routes Tests
describe('Auth admin access POST monitorUser', () => {
    it('should return 200 and users data', async () => {
        const response = await request(app)
            .post('/admin/auth/get-user-monitoring')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                filter: ''
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Users fetched successfully');
    });

    it('should return 403 if not admin', async () => {
        const response = await request(app)
            .post('/admin/auth/get-user-monitoring')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .send({
                filter: {}
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Access denied. Admin rights required.');
    });

    it('should return 404 if no users found', async () => {
        jest.spyOn(Auth, 'getMonitor').mockResolvedValue(null);
        
        const response = await request(app)
            .post('/admin/auth/get-user-monitoring')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                filter: {}
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one users');
    });
});

describe('Auth admin access PUT updateStatus', () => {
    it('should return 200 when status updated successfully', async () => {
        const response = await request(app)
            .put(`/admin/auth/update-status/${responseCreateUser.body.data.idVerified}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                status: true
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Status di Edited');
    });

    it('should return 400 when status is missing', async () => {
        const response = await request(app)
            .put(`/admin/auth/update-status/${responseCreateUser.body.data.idVerified}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Status is required');
    });

    it('should return 404 when user not found', async () => {
        const response = await request(app)
            .put('/admin/auth/update-status/0')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                status: true
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Auth, 'updateStatus').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .put(`/admin/auth/update-status/${responseCreateUser.body.data.idVerified}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                status: true
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Server error'
        });

        jest.restoreAllMocks();
    });
});

afterAll(async () => {
    try {
        if (responseCreateUser) {
            await pool.query('DELETE FROM auth WHERE email = $1', ['test@example.com']);
        }
        await pool.end();
    } catch (error) {
        console.error('Cleanup error:', error);
        await pool.end();
    }
});
