const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const Genre = require('../models/genre.model');

let authTokenAdmin;
let userRoleAdmin;
let responseCreateGenre;

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
describe('Genre public access GET getAllGenres', () => {
    it('should return 200 and all genres', async () => {
        const response = await request(app)
            .get('/api/genre/get-all');

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Success fetch all genre');
    });

    it('should return 404 if no genres found', async () => {
        jest.spyOn(Genre, 'getAll').mockResolvedValue(null);
        
        const response = await request(app)
            .get('/api/genre/get-all');

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one genre');
        jest.restoreAllMocks();
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Genre, 'getAll').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get('/api/genre/get-all');

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');
        jest.restoreAllMocks();
    });
});

// Admin Routes Tests
describe('Genre admin access POST createGenre', () => {
    it('should return 201 and create new genre', async () => {
        responseCreateGenre = await request(app)
            .post('/admin/genre/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                genre: 'Test Genre'
            });

        expect(responseCreateGenre.statusCode).toBe(201);
        expect(responseCreateGenre.body.message).toBe('Success');
        expect(responseCreateGenre.body.data).toHaveProperty('genre', 'Test Genre');
    });

    it('should return 400 when genre already exists', async () => {
        jest.spyOn(Genre, 'check').mockResolvedValue(true);

        const response = await request(app)
            .post('/admin/genre/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                genre: 'Existing Genre'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Genre already exists');
        jest.restoreAllMocks();
    });

    it('should return 500 when there is an error', async () => {
        jest.spyOn(Genre, 'create').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/admin/genre/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                name: 'Test Genre'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');
        jest.restoreAllMocks();
    });
});

describe('Genre admin access PUT updateGenre', () => {
    it('should return 200 when genre updated successfully', async () => {
        jest.spyOn(Genre, 'check').mockResolvedValue({
            id_genre: responseCreateGenre.body.data.id_genre,
            genre: 'Test Genre'
        });

        const response = await request(app)
            .put(`/admin/genre/update/${responseCreateGenre.body.data.id_genre}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                name: 'Updated Genre'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success');
        jest.restoreAllMocks();
    });

    it('should return 400 when ID is invalid', async () => {
        const response = await request(app)
            .put('/admin/genre/update/invalid')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                name: 'Updated Genre'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid ID');
    });

    it('should return 400 when name is missing', async () => {
        const response = await request(app)
            .put(`/admin/genre/update/${responseCreateGenre.body.data.id_genre}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Genre name is required');
    });

    it('should return 404 when genre not found', async () => {
        jest.spyOn(Genre, 'check').mockResolvedValue(false);

        const response = await request(app)
            .put('/admin/genre/update/999')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                name: 'Updated Genre'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Genre ID not found');
        jest.restoreAllMocks();
    });

    it('should return 500 when there is an error', async () => {
        jest.spyOn(Genre, 'check').mockResolvedValue(true);
        jest.spyOn(Genre, 'update').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .put(`/admin/genre/update/${responseCreateGenre.body.data.id_genre}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                name: 'Updated Genre'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');
        jest.restoreAllMocks();
    });
});

describe('Genre admin access DELETE deleteGenre', () => {
    it('should return 200 when genre deleted successfully', async () => {
        jest.spyOn(Genre, 'check').mockResolvedValue(true);
        jest.spyOn(Genre, 'delete').mockResolvedValue({
            id_genre: responseCreateGenre.body.data.id_genre,
            genre: 'Test Genre'
        });

        const response = await request(app)
            .delete(`/admin/genre/delete/${responseCreateGenre.body.data.id_genre}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Genre Test Genre deleted successfully!');
        jest.restoreAllMocks();
    });

    it('should return 404 when genre not found', async () => {
        jest.spyOn(Genre, 'check').mockResolvedValue(false);

        const response = await request(app)
            .delete('/admin/genre/delete/999')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Genre not found');
        jest.restoreAllMocks();
    });

    it('should return 400 when genre is referenced by movies', async () => {
        jest.spyOn(Genre, 'check').mockResolvedValue(true);
        jest.spyOn(Genre, 'delete').mockRejectedValue({ code: '23503' });

        const response = await request(app)
            .delete(`/admin/genre/delete/${responseCreateGenre.body.data.id_genre}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Cannot delete genre as it is still referenced in other tables.');
        jest.restoreAllMocks();
    });

    it('should return 500 when there is an error', async () => {
        jest.spyOn(Genre, 'check').mockResolvedValue(true);
        jest.spyOn(Genre, 'delete').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .delete(`/admin/genre/delete/${responseCreateGenre.body.data.id_genre}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');
        jest.restoreAllMocks();
    });
});

afterAll(async () => {
    try {
        await pool.query('DELETE FROM genre WHERE genre = $1', ['Test Genre']);
        await pool.end();
    } catch (error) {
        console.error('Cleanup error:', error);
        await pool.end();
    }
});
