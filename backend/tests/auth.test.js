const request = require('supertest');
const app = require('../app');
const db = require('../config/database');

beforeAll((done) => {
    process.env.NODE_ENV = 'test';
    
    // Ensure clean state
    db.serialize(() => {
        db.run("DELETE FROM users", done);
    });
});

afterAll((done) => {
    db.close();
    done();
});

describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                fullname: 'John Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123'
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should not register user with existing email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                fullname: 'John Doe 2',
                username: 'johndoe2',
                email: 'john@example.com', // same email
                password: 'password123'
            });
            
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'password123'
            });
            
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'john@example.com');
    });

    it('should not login with wrong credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'john@example.com',
                password: 'wrongpassword'
            });
            
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
});
