const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const Film = require('../models/film.model');

let authTokenAdmin;
let userRoleAdmin;
let authTokenUser;
let userRoleUser;
let filmId = 95;
let containerFilmId;

jest.setTimeout(1000);

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

    // Login sebagai user untuk mendapatkan token
    const loginResponseUser = await request(app)
        .post('/api/auth/sign-in')
        .send({
            username: 'users', password: 'users' });

    authTokenUser = loginResponseUser.body.data.token;
    userRoleUser = loginResponseUser.body.data.role;
});

// Public Routes Tests
describe('Film public access GET getAllFilms', () => {
    it('should return 200 and all films', async () => {
        const response = await request(app)
            .get('/api/film/get-all')
            .query({
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Success get all films');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 200 and all films with filter country', async () => {
        const response = await request(app)
            .get('/api/film/get-all')
            .query({ country: 1 });

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Success get all films');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 200 even without query parameters', async () => {
        const response = await request(app)
            .get('/api/film/get-all');

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Film, 'getAll').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get('/api/film/get-all');

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');

        jest.restoreAllMocks();
    });
});

describe('Film public access GET getFilmSearch', () => {
    it('should return 200 and searched films', async () => {
        const response = await request(app)
            .get('/api/film/search')
            .query({
                search: 'ava'});

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.message).toBe('Success get films by search');
    });

    it('should return 200 and handle search with filter country', async () => {
        const response = await request(app)
            .get('/api/film/search')
            .query({ search: 'ava', country: 1 });

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.message).toBe('Success get films by search');
    });

    it('should return 404 if no search results', async () => {
        const response = await request(app)
            .get('/api/film/search')
            .query({ search: 'nonexistent' });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one search film found');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Film, 'getBySearch').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get('/api/film/search')
            .query({ search: 'nonexistent' });

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');

        jest.restoreAllMocks();
    });
});

describe('Film public access GET getFilmById', () => {

    it('should return 200 and film details', async () => {
        const response = await request(app)
            .get(`/api/film/get-by-id/${filmId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Success');
        expect(response.body.data.id).toBe(filmId);
    });

    it('should return 404 for non-existent film', async () => {
        const response = await request(app)
            .get('/api/film/get-by-id/99999');

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Film not found');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Film, 'getById').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get(`/api/film/get-by-id/${filmId}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');

        jest.restoreAllMocks();
    });
});

describe('Film public access POST updatePlusView', () => {
    it('should return 200 when view incremented successfully', async () => {
        const response = await request(app)
            .post(`/api/film/increment-view/${filmId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('View incremented successfully');
    });

    it('should return 404 and handle increment view for non-existent film', async () => {
        const response = await request(app)
            .post('/api/film/increment-view/99999');

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Film not found');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Film, 'plusView').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post(`/api/film/increment-view/${filmId}`);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');

        jest.restoreAllMocks();
    });
});


describe('Film authenticated access POST createFilm', () => {
    // Data dummy untuk test
    const mockFilmData = {
        title: 'Test Film',
        alt_title: 'Film Test',
        year: 2024,
        country: 1,
        synopsis: 'This is a test film synopsis',
        link_trailer: 'https://youtube.com/test',
        availability: 'free',
        status: 'active',
        posted_by: 1,
        award: JSON.stringify([{
            "value": 130,
            "label": "312 - Bismilah - adwa"
        }]),
        genre: JSON.stringify([{
            "id": "7",
            "label": "Fantasy"
        }]),
        actor: [JSON.stringify({
            "id": 378,
            "cast": "Jake Sully"
        })]
    };

    const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
    const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64');

    it('should return 201 when film created successfully', async () => {
        containerFilmId = await request(app)
            .post('/auth/film/create')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .attach('picture', imageBuffer, 'image.jpg')
            .field('title', mockFilmData.title)
            .field('alt_title', mockFilmData.alt_title)
            .field('year', mockFilmData.year)
            .field('country', mockFilmData.country)
            .field('synopsis', mockFilmData.synopsis)
            .field('link_trailer', mockFilmData.link_trailer)
            .field('availability', mockFilmData.availability)
            .field('status', mockFilmData.status)
            .field('posted_by', mockFilmData.posted_by)
            .field('award', mockFilmData.award)
            .field('genre', mockFilmData.genre)
            .field('actor[]', mockFilmData.actor[0]);

        expect(containerFilmId.statusCode).toBe(201);
        expect(containerFilmId.body.message).toBe('Film berhasil dibuat');
    });

    it('should return 400 when image is missing', async () => {
        const response = await request(app)
            .post('/auth/film/create')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .field('title', mockFilmData.title)
            .field('alt_title', mockFilmData.alt_title)
            .field('year', mockFilmData.year)
            .field('country', mockFilmData.country)
            .field('synopsis', mockFilmData.synopsis)
            .field('link_trailer', mockFilmData.link_trailer)
            .field('availability', mockFilmData.availability)
            .field('status', mockFilmData.status)
            .field('posted_by', mockFilmData.posted_by)
            .field('award', mockFilmData.award)
            .field('genre', mockFilmData.genre)
            .field('actor[]', mockFilmData.actor[0]);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('image is required');
    });

    it('should return 400 when required fields are missing', async () => {
        const response = await request(app)
            .post('/auth/film/create')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .attach('picture', imageBuffer, 'image.jpg')
            // Hanya kirim sebagian field
            .field('title', mockFilmData.title)
            .field('alt_title', mockFilmData.alt_title);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    it('should return 500 when database error occurs', async () => {
        // Mock Film.create untuk throw error
        jest.spyOn(Film, 'create').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/auth/film/create')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .attach('picture', imageBuffer, 'image.jpg')
            .field('title', mockFilmData.title)
            .field('alt_title', mockFilmData.alt_title)
            .field('year', mockFilmData.year)
            .field('country', mockFilmData.country)
            .field('synopsis', mockFilmData.synopsis)
            .field('link_trailer', mockFilmData.link_trailer)
            .field('availability', mockFilmData.availability)
            .field('status', mockFilmData.status)
            .field('posted_by', mockFilmData.posted_by)
            .field('award', mockFilmData.award)
            .field('genre', mockFilmData.genre)
            .field('actor[]', mockFilmData.actor[0]);

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server error');

        // Restore mock
        jest.restoreAllMocks();
    });
});

describe('Film admin access', () => {
    // Data dummy untuk test
    const mockFilmData = {
        title: 'Test Film',
        alt_title: 'Film Test',
        year: 2024,
        country: 1,
        synopsis: 'This is a test film synopsis',
        link_trailer: 'https://youtube.com/test',
        availability: 'free',
        status: 'active',
        posted_by: 1,
        award: JSON.stringify([{
            "value": 130,
            "label": "312 - Bismilah - adwa"
        }]),
        genre: JSON.stringify([{
            "id": "7",
            "label": "Fantasy"
        }]),
        actor: [JSON.stringify({
            "id": 378,
            "cast": "Jake Sully"
        })]
    };

    const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
    const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64');

    // Buat film terlebih dahulu dan simpan ID-nya
    beforeAll(async () => {
        const createResponse = await request(app)
            .post('/auth/film/create')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .attach('picture', imageBuffer, 'image.jpg')
            .field('title', mockFilmData.title)
            .field('alt_title', mockFilmData.alt_title)
            .field('year', mockFilmData.year)
            .field('country', mockFilmData.country)
            .field('synopsis', mockFilmData.synopsis)
            .field('link_trailer', mockFilmData.link_trailer)
            .field('availability', mockFilmData.availability)
            .field('status', mockFilmData.status)
            .field('posted_by', mockFilmData.posted_by)
            .field('award', mockFilmData.award)
            .field('genre', mockFilmData.genre)
            .field('actor[]', mockFilmData.actor[0]);
    });

    describe('GET /admin/film/validate', () => {
        it('should return 200 and all films for validation', async () => {
            const response = await request(app)
                .get('/admin/film/validate')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Fetch Validate Film Success');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should return 500 when database error occurs', async () => {
            jest.spyOn(Film, 'getAllValidate').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/admin/film/validate')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Server error');

            jest.restoreAllMocks();
        });
    });

    describe('GET /admin/film/get-edit/:id', () => {
        it('should return 200 and film details for editing', async () => {
            const response = await request(app)
                .get(`/admin/film/get-edit/${filmId}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Fetch Edit Film Success');
            expect(response.body.data).toBeDefined();
        });

        it('should return 404 for non-existent film', async () => {
            const response = await request(app)
                .get('/admin/film/get-edit/99999')
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin);

            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Film not found');
        });

        it('should return 500 when database error occurs', async () => {
            jest.spyOn(Film, 'getFilmEdit').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/admin/film/get-edit/${filmId}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Server error');

            jest.restoreAllMocks();
        });
    });

    describe('PUT /admin/film/update-validate/:id', () => {
        it('should return 200 when film validated successfully', async () => {
            const response = await request(app)
                .put(`/admin/film/update-validate/${filmId}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Film di Approve');
        });

        it('should return 500 when database error occurs', async () => {
            jest.spyOn(Film, 'updateValidate').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put(`/admin/film/update-validate/${filmId}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Server error');

            jest.restoreAllMocks();
        });
    });

    describe('PUT /admin/film/save-edit/:id', () => {
        it('should return 201 when film edited successfully', async () => {
            const response = await request(app)
                .put(`/admin/film/save-edit/${filmId}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin)
                .field('title', mockFilmData.title)
                .field('picture', base64Image)
                .field('alt_title', mockFilmData.alt_title)
                .field('year', mockFilmData.year)
                .field('country', mockFilmData.country)
                .field('synopsis', mockFilmData.synopsis)
                .field('link_trailer', mockFilmData.link_trailer)
                .field('availability', mockFilmData.availability)
                .field('status', mockFilmData.status)
                .field('award', mockFilmData.award)
                .field('genre', mockFilmData.genre)
                .field('actor[]', mockFilmData.actor[0]);

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Film berhasil Save');
        });

        it('should return 400 when required fields are missing', async () => {
            const response = await request(app)
                .put(`/admin/film/save-edit/${filmId}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin)
                .field('title', mockFilmData.title);

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('All fields are required');
        });

        it('should return 500 when database error occurs', async () => {
            jest.spyOn(Film, 'updateEditFilm').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put(`/admin/film/save-edit/${filmId}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin)
                .field('title', mockFilmData.title)
                .field('picture', base64Image)
                .field('alt_title', mockFilmData.alt_title)
                .field('year', mockFilmData.year)
                .field('country', mockFilmData.country)
                .field('synopsis', mockFilmData.synopsis)
                .field('link_trailer', mockFilmData.link_trailer)
                .field('availability', mockFilmData.availability)
                .field('status', mockFilmData.status)
                .field('award', mockFilmData.award)
                .field('genre', mockFilmData.genre)
                .field('actor[]', mockFilmData.actor[0]);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Terjadi kesalahan saat membuat film');

            jest.restoreAllMocks();
        });
    });

    describe('DELETE /admin/film/delete/:id', () => {
        it('should return 200 when film deleted successfully', async () => {
            const response = await request(app)
                .delete(`/admin/film/delete/${containerFilmId.body.data.id_film}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Film deleted successfully');
        });

        it('should return 500 when database error occurs', async () => {
            jest.spyOn(Film, 'delete').mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .delete(`/admin/film/delete/${filmId}`)
                .set('Authorization', `Bearer ${authTokenAdmin}`)
                .set('x-role', userRoleAdmin);

            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Server error');

            jest.restoreAllMocks();
        });
    });
});

afterAll(async () => {
    await pool.end();
});
