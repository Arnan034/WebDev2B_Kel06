const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const Country = require('../models/country.model');

let authTokenAdmin;
let userRoleAdmin;
let country;

// Tambahkan timeout yang lebih lama jika diperlukan
jest.setTimeout(10000);

beforeAll(async () => {
    // Login sebagai admin untuk mendapatkan token
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
describe('Country public access GET getAllCountries', () => {
    it('should return 200 and all countries', async () => {
        const response = await request(app)
            .get('/api/country/get-all');

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Country fetched successfully');
    });

    it('should return 404 if no countries found', async () => {
        jest.spyOn(Country, 'getAll').mockResolvedValue(null);
        
        const response = await request(app)
            .get('/api/country/get-all');

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one country');
        jest.restoreAllMocks();
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Country, 'getAll').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get('/api/country/get-all');

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');
        jest.restoreAllMocks();
    });
});

// Admin Routes Tests
describe('Country admin access POST createCountry', () => {
    it('should return 201 and create new country', async () => {
        country = await request(app)
            .post('/admin/country/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country_name: 'Test Country'
            });

        expect(country.statusCode).toBe(201);
        expect(country.body.message).toBe('Country created successfully');
    });

    it('should return 400 when country name is missing', async () => {
        const response = await request(app)
            .post('/admin/country/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Country name is required');
    });

    it('should return 400 when country already exists', async () => {
        jest.spyOn(Country, 'check').mockResolvedValue(true);

        const response = await request(app)
            .post('/admin/country/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country_name: 'Existing Country'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Country already exists');
        jest.restoreAllMocks();
    });

    it('should return 500 when there is an error', async () => {
        jest.spyOn(Country, 'create').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/admin/country/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country_name: 'Test Countrys'
            });
        console.log(response.body.message);
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');
        jest.restoreAllMocks();
    });
});

describe('Country admin access PUT updateCountry', () => {
    it('should return 200 when country updated successfully', async () => {
        jest.spyOn(Country, 'check').mockResolvedValue(true);

        const response = await request(app)
            .put(`/admin/country/update/${country.body.data.id_country}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                name: 'Updated Country'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Country updated successfully');
        jest.restoreAllMocks();
    });

    it('should return 400 when ID is invalid', async () => {
        const response = await request(app)
            .put('/admin/country/update/invalid')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                name: 'Updated Country'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid ID');
    });

    it('should return 400 when name is missing', async () => {
        const response = await request(app)
            .put(`/admin/country/update/${country.body.data.id_country}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Country name is required');
    });

    it('should return 404 when country not found', async () => {
        jest.spyOn(Country, 'check').mockResolvedValue(false);

        const response = await request(app)
            .put('/admin/country/update/999')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                name: 'Updated Country'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Country ID not found');
        jest.restoreAllMocks();
    });

    it('should return 500 when there is an error', async () => {
        jest.spyOn(Country, 'check').mockResolvedValue(true);
        jest.spyOn(Country, 'update').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .put('/admin/country/update/1')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                name: 'Updated Country'
            });
        console.log(response.body.message);
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');
        jest.restoreAllMocks();
    });
});

describe('Country admin access DELETE deleteCountry', () => {
    it('should return 200 when country deleted successfully', async () => {
        jest.spyOn(Country, 'check').mockResolvedValue(true);
        jest.spyOn(Country, 'delete').mockResolvedValue({
            id_country: 1,
            country_name: 'Test Country'
        });

        const response = await request(app)
            .delete('/admin/country/delete/1')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Country "Test Country" deleted successfully!');
        jest.restoreAllMocks();
    });

    it('should return 404 when country not found', async () => {
        jest.spyOn(Country, 'check').mockResolvedValue(false);

        const response = await request(app)
            .delete('/admin/country/delete/999')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Country not found');
        jest.restoreAllMocks();
    });

    it('should return 400 when country is referenced by movies', async () => {
        jest.spyOn(Country, 'check').mockResolvedValue(true);
        jest.spyOn(Country, 'delete').mockRejectedValue({ code: '23503' });

        const response = await request(app)
            .delete('/admin/country/delete/1')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Cant delete the country because its still the movie being referenced.');
        jest.restoreAllMocks();
    });

    it('should return 500 when there is an error', async () => {
        jest.spyOn(Country, 'check').mockResolvedValue(true);
        jest.spyOn(Country, 'delete').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .delete('/admin/country/delete/1')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');
        jest.restoreAllMocks();
    });
});

afterAll(async () => {
    try {
        await pool.query('DELETE FROM country WHERE country_name = $1', ['Test Country']);
        await pool.end();
    } catch (error) {
        console.error('Cleanup error:', error);
        await pool.end();
    }
});
