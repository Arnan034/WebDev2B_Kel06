//server/src/tests/actor.test.j
const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const Actor = require('../models/actor.model'); // sesuaikan dengan path model Anda

// let client;

// beforeAll(async () => {
//     try {
//         client = await pool.connect();
        
//         // Insert test data menggunakan client
//         await client.query('INSERT INTO actor (country, name, birth_date, picture) VALUES ($1, $2, $3, $4)', [
//           'example country',
//           'example name',
//           '1983-04-03',
//           'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
//         ]);
//     } catch (error) {
//         console.error('Setup error:', error);
//         throw error;
//     }
// });

// afterAll(async () => {  
//     try {
//         if (client) {
//             // Cleanup test data
//             await client.query('DELETE FROM actor WHERE name = $1', ['example name']);
//             client.release(); // Release the client back to the pool
//         }
//         await pool.end(); // Close all connections in the pool
//     } catch (error) {
//         console.error('Cleanup error:', error);
//         throw error;
//     }
// });

//describe actor controller public
describe('Actor public access GET getActorByIdFilm', () => {
    it('should return 200 and the actor', async () => {
        const response = await request(app).get('/api/actor/get-by-id-film/1');

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Film actors retrieved successfully');
    });

    it('should return 400 if film not found', async () => {
        const response = await request(app).get('/api/actor/get-by-id-film/0');
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Film not found');
    });

    it('should return 404 if the actor does not exist', async () => {
        const response = await request(app).get('/api/actor/get-by-id-film/95');
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No actors found for this film');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Actor, 'getByIdFilm').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app).get('/api/actor/get-by-id-film/1');
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });

        // Bersihkan mock
        jest.restoreAllMocks();
    });
});

describe('Actor public access GET getActorById', () => {
    it('should return 200 and the actor', async () => {
        const response = await request(app).get('/api/actor/get-by-id/1');

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Actor retrieved successfully');
    });

    it('should return 404 if the actor does not exist', async () => {
        const response = await request(app).get('/api/actor/get-by-id/0');
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Actor not found');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Actor, 'getById').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app).get('/api/actor/get-by-id/1');
        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });
    });
});

describe('Actor admin access GET getAllActor', () => {
    it('should return 200 and the actors', async () => {
        const response = await request(app).get('/api/actor/get-all');

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Actors retrieved successfully');
    });

    it('should return 404 if no actors found', async () => {
        jest.spyOn(Actor, 'getAll').mockResolvedValue([]);
        const response = await request(app).get('/api/actor/get-all');
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No actors found');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Actor, 'getAll').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app).get('/api/actor/get-all');
        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });
    });
});

