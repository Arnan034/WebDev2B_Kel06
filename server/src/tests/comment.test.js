const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const Comment = require('../models/comment.model');

let authTokenUser;
let userRoleUser;
let authTokenAdmin;
let userRoleAdmin;
let userId;
let filmId = 1;
let responseCreateComment;

// Tambahkan timeout yang lebih lama jika diperlukan
jest.setTimeout(10000);

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
describe('Comment public access GET getCommentByIdFilm', () => {
    it('should return 200 and film comments', async () => {
        const response = await request(app)
            .get(`/api/comment/get-by-film/${filmId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Comment fetched successfully');
    });

    it('should return 404 if no comments found', async () => {
        jest.spyOn(Comment, 'findByIdFilm').mockResolvedValue(null);
        
        const response = await request(app)
            .get(`/api/comment/get-by-film/${filmId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one comment in this film');

        jest.restoreAllMocks();
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Comment, 'findByIdFilm').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .get(`/api/comment/get-by-film/${filmId}`);

        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });

        jest.restoreAllMocks();
    });
});

// Auth Routes Tests
describe('Comment auth access POST createComment', () => {
    it('should return 201 and create new comment', async () => {
        responseCreateComment = await request(app)
            .post(`/auth/comment/create/${userId}/${filmId}`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .send({
                rating: 4,
                review: 'Great movie!'
            });
        expect(responseCreateComment.statusCode).toBe(201);
        expect(responseCreateComment.body.message).toBe('Comment created');
    });

    it('should return 400 when rating or review is missing', async () => {
        const response = await request(app)
            .post(`/auth/comment/create/${userId}/${filmId}`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .send({
                rating: 4
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Rating and review are required');
    });

    it('should return 400 when rating is invalid', async () => {
        const response = await request(app)
            .post(`/auth/comment/create/${userId}/${filmId}`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .send({
                rating: 6,
                review: 'Invalid rating'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Rating must be between 1 and 5');
    });
});

// Admin Routes Tests
describe('Comment admin access GET getAllComments', () => {
    it('should return 200 and all comments', async () => {
        const response = await request(app)
            .get('/admin/comment/get-all')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Comments fetched successfully');
    });

    it('should return 404 if no comments found', async () => {
        jest.spyOn(Comment, 'findAll').mockResolvedValue(null);

        const response = await request(app)
            .get('/admin/comment/get-all')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No one comments');

        jest.restoreAllMocks();
    });
});

// Test untuk updateApproveComment
describe('Comment admin access PUT updateApproveComment', () => {
    it('should return 200 when comments approved successfully', async () => {
        const response = await request(app)
            .put('/admin/comment/update-approve')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                ids: [responseCreateComment.body.data.id_comment]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Update approve comment successfully');
    });

    it('should return 400 when ID list is missing', async () => {
        const response = await request(app)
            .put('/admin/comment/update-approve')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('ID list is required');
    });


    it('should return 404 when comment not found', async () => {
        jest.spyOn(Comment, 'approveComment').mockResolvedValue(null);

        const response = await request(app)
            .put('/admin/comment/update-approve')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                ids: [999]
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('One or more comments not found');
        jest.restoreAllMocks();
    });

    it('should return 500 when there is an error', async () => {
        jest.spyOn(Comment, 'approveComment').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .put('/admin/comment/update-approve')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                ids: [responseCreateComment.body.data.id_comment]
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: 'Server error'
        });
        jest.restoreAllMocks();
    });
});

// Test untuk deleteComment
describe('Comment admin access DELETE deleteComment', () => {
    it('should return 200 when comments deleted successfully', async () => {
        const response = await request(app)
            .delete('/admin/comment/delete')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                ids: [responseCreateComment.body.data.id_comment]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Delete Comment successfully.');
    });

    it('should return 400 when ID list is missing', async () => {
        const response = await request(app)
            .delete('/admin/comment/delete')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('ID list is required');
    });

    it('should return 400 when ID list is empty', async () => {
        const response = await request(app)
            .delete('/admin/comment/delete')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                ids: []
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid or empty ID list.');
    });

    it('should return 404 when comment not found', async () => {
        jest.spyOn(Comment, 'deleteComment').mockResolvedValue(null);

        const response = await request(app)
            .delete('/admin/comment/delete')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                ids: [999]
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('One or more comments not found');
        jest.restoreAllMocks();
    });

    it('should return 500 when there is an error', async () => {
        jest.spyOn(Comment, 'deleteComment').mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .delete('/admin/comment/delete')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                ids: [responseCreateComment.body.data.id_comment]
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
        if (responseCreateComment) {
            await pool.query('DELETE FROM comment WHERE id_user = $1 AND id_film = $2', [userId, filmId]);
        }
        await pool.end();
    } catch (error) {
        console.error('Cleanup error:', error);
        await pool.end();
    }
});
