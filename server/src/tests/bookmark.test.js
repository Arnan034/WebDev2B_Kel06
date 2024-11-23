const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const Bookmark = require('../models/bookmark.model');

let authTokenUser;
let userRoleUser;
let userId;
let filmId = 1; // Asumsi film ID 1 tersedia di database
let responseCreateBookmark;

beforeAll(async () => {
    const loginResponseUser = await request(app)
        .post('/api/auth/sign-in')
        .send({
            username: 'users',
            password: 'users'
        });
    authTokenUser = loginResponseUser.body.data.token;
    userRoleUser = loginResponseUser.body.data.role;
    userId = loginResponseUser.body.data.id_user;
});

// Auth Routes Tests
describe('Bookmark auth access GET getBookmarkFilm', () => {
    it('should return 200 and user bookmarks', async () => {
        const response = await request(app)
            .get(`/auth/bookmark/get-bookmark/${userId}`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Bookmark fetched successfully');
    });

    it('should return 404 if no bookmarks found', async () => {
        jest.spyOn(Bookmark, 'getBookmark').mockResolvedValue(null);
        
        const response = await request(app)
            .get(`/auth/bookmark/get-bookmark/${userId}`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one bookmark film');

        jest.restoreAllMocks();
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Bookmark, 'getBookmark').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get(`/auth/bookmark/get-bookmark/${userId}`)
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

describe('Bookmark auth access GET getUserBookmarkFilm', () => {
    it('should return 200 and bookmark status', async () => {
        const response = await request(app)
            .get(`/auth/bookmark/get-user-bookmark/${userId}/${filmId}`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('isBookmarked');
        expect(response.body.message).toBe('Bookmark status fetched successfully');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Bookmark, 'getUserBookmark').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get(`/auth/bookmark/get-user-bookmark/${userId}/${filmId}`)
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

describe('Bookmark auth access POST createBookmark', () => {
    it('should return 201 and create new bookmark', async () => {
        responseCreateBookmark = await request(app)
            .post('/auth/bookmark/create')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .send({
                userId: userId,
                filmId: filmId
            });

        expect(responseCreateBookmark.statusCode).toBe(201);
        expect(responseCreateBookmark.body.message).toBe('Bookmark added successfully');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Bookmark, 'addBookmark').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/auth/bookmark/create')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .send({
                userId: userId,
                filmId: filmId
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });

        jest.restoreAllMocks();
    });
});

describe('Bookmark auth access DELETE deleteBookmark', () => {
    it('should return 200 and delete the bookmark', async () => {
        const response = await request(app)
            .delete(`/auth/bookmark/delete/${userId}/${filmId}`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Bookmark removed successfully');
    });

    it('should return 404 when bookmark not found', async () => {
        jest.spyOn(Bookmark, 'delBookmark').mockResolvedValue(null);

        const response = await request(app)
            .delete(`/auth/bookmark/delete/${userId}/999`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Bookmark not found');

        jest.restoreAllMocks();
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Bookmark, 'delBookmark').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .delete(`/auth/bookmark/delete/${userId}/${filmId}`)
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

afterAll(async () => {
    try {
        if (responseCreateBookmark) {
            await pool.query('DELETE FROM bookmark WHERE id_user = $1 AND id_film = $2', [userId, filmId]);
        }
        await pool.end();
    } catch (error) {
        console.error('Cleanup error:', error);
        await pool.end();
    }
});
