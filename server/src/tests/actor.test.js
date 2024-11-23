//server/src/tests/actor.test.j
const request = require('supertest');
const app = require('../server');
const pool = require('../config/db');
const Actor = require('../models/actor.model'); // sesuaikan dengan path model Anda

let authTokenUser;
let userRoleUser;
let authTokenAdmin;
let userRoleAdmin;
let responseCreateActor;

//login before all test
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

// describe actor controller public
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

        jest.restoreAllMocks();
    });
});

describe('Actor admin access GET getAllActor', () => {
    let authToken;
    let userRole;

    //login before all test
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/api/auth/sign-in')
            .send({
                username: 'users',
                password: 'users'
            });
        authToken = loginResponse.body.data.token;
        userRole = loginResponse.body.data.role;
    });

    it('should return 200 and the actors', async () => {
        const response = await request(app)
            .get('/auth/actor/get-all')
            .set('Authorization', `Bearer ${authToken}`)
            .set('x-role', userRole);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Actors retrieved successfully');
    });

    it('should return 404 if no actors found', async () => {
        jest.spyOn(Actor, 'getAll').mockResolvedValue([]);
        const response = await request(app)
            .get('/auth/actor/get-all')
            .set('Authorization', `Bearer ${authToken}`)
            .set('x-role', userRole);
            
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('No actors found');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Actor, 'getAll').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/auth/actor/get-all')
            .set('Authorization', `Bearer ${authToken}`)
            .set('x-role', userRole);
        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });

        jest.restoreAllMocks();
    });
});

describe('Actor admin access POST createActor', () => {

    it('should return 201 and the actor', async () => {
        responseCreateActor = await request(app)
            .post('/admin/actor/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country: 'example country',
                name: 'example name',
                birth_date: '1983-04-03',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
        });
        console.log(responseCreateActor.body.data);
        expect(responseCreateActor.statusCode).toBe(201);
        expect(responseCreateActor.body.data).toBeDefined();
        expect(responseCreateActor.body.message).toBe('Actor created successfully');
    });

    it('should return 403 if the request header not admin', async () => {
        const response = await request(app)
            .post('/admin/actor/create')
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .send({
                country: 'example country',
                name: 'example name xxx',
                birth_date: '1983-04-03',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Access denied. Admin rights required.');
    });

    it('should return 400 if the request body is invalid', async () => {
        const response = await request(app)
            .post('/admin/actor/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country: 'example country',
                name: 'example name xxx',
                birth_date: '1983-04-03',
        });;

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    it('should return 409 if the actor already exists', async () => {
        const response = await request(app)
            .post('/admin/actor/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country: 'example country',
                name: 'example name',
                birth_date: '1983-04-03',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
            });

        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe('Actor already exists');
    });


    it('should return 500 if there is an error', async () => {
        jest.spyOn(Actor, 'create').mockImplementation(() => {
            throw new Error('Database error');
        });
        const response = await request(app)
            .post('/admin/actor/create')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country: 'example country',
                name: 'example name xxx',
                birth_date: '1983-04-03',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
            });
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });
    });
});

describe('Actor admin access PUT updateActor', () => {
    it('should return 200 and the updated actor', async () => {
        const response = await request(app)
            .put(`/admin/actor/update/${responseCreateActor.body.data.id_actor}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country: 'example country',
                name: 'example name xx',
                birth_date: '1983-04-03',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Actor updated successfully');
    });

    it('should return 403 if the request header not admin', async () => {
        const response = await request(app)
            .put(`/admin/actor/update/${responseCreateActor.body.data.id_actor}`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser)
            .send({
                country: 'example country',
                name: 'example name xx',
                birth_date: '1983-04-03',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Access denied. Admin rights required.');
    });

    it('should return 400 if the request body is invalid', async () => {
        const response = await request(app)
            .put(`/admin/actor/update/${responseCreateActor.body.data.id_actor}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country: 'example country',
                name: 'example name xx',
                birth_date: '1983-04-03',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    it('should return 404 if the actor does not exist', async () => {
        const response = await request(app)
            .put('/admin/actor/update/0')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country: 'example country',
                name: 'example name xx',
                birth_date: '1983-04-03',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Actor not found');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Actor, 'update').mockImplementation(() => {
            throw new Error('Database error');
        });
        const response = await request(app)
            .put(`/admin/actor/update/${responseCreateActor.body.data.id_actor}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin)
            .send({
                country: 'example country',
                name: 'example name xx',
                birth_date: '1983-04-03',
                picture: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
            });
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });
    });
});

describe('Actor admin access DELETE deleteActor', () => {
    it('should return 200 and the deleted actor', async () => {
        const response = await request(app)
            .delete(`/admin/actor/delete/${responseCreateActor.body.data.id_actor}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.message).toBe('Actor deleted successfully');
    });

    it('should return 403 if the request header not admin', async () => {
        const response = await request(app)
            .delete(`/admin/actor/delete/${responseCreateActor.body.data.id_actor}`)
            .set('Authorization', `Bearer ${authTokenUser}`)
            .set('x-role', userRoleUser);

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Access denied. Admin rights required.');
    });

    it('should return 404 if the actor does not exist', async () => {
        const response = await request(app)
            .delete('/admin/actor/delete/0')
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Actor not found');
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(Actor, 'delete').mockImplementation(() => {
            throw new Error('Database error');
        });
        const response = await request(app)
            .delete(`/admin/actor/delete/${responseCreateActor.body.data.id_actor}`)
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            .set('x-role', userRoleAdmin);

        expect(response.statusCode).toBe(500);
        expect(response.body).toMatchObject({
            status: 'error',
            message: expect.any(String)
        });
    }); 
});