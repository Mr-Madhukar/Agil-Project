const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const bcrypt = require('bcryptjs');

let userToken;
let userId;
let packageId;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    
    // Clean tables
    await new Promise((resolve) => db.run("DELETE FROM reviews", resolve));
    await new Promise((resolve) => db.run("DELETE FROM packages", resolve));
    await new Promise((resolve) => db.run("DELETE FROM users", resolve));

    // Seed User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await new Promise((resolve) => {
        db.run(
            'INSERT INTO users (fullname, username, email, password_hash) VALUES (?, ?, ?, ?)',
            ['Review Tester', 'revtest', 'rev@example.com', hashedPassword],
            function(err) {
                userId = this.lastID;
                resolve();
            }
        );
    });

    // Seed Package
    await new Promise((resolve) => {
        db.run(
            'INSERT INTO packages (destination, duration, price_inr, price_usd, rating) VALUES (?, ?, ?, ?, ?)',
            ['Review Dest', '3 Days', '100', '1', 5],
            function(err) {
                packageId = this.lastID;
                resolve();
            }
        );
    });

    // Login User
    const res = await request(app).post('/api/auth/login').send({ email: 'rev@example.com', password: 'password123' });
    userToken = res.body.token;
});

afterAll((done) => {
    db.close();
    done();
});

describe('Reviews API', () => {

    it('should create a new review', async () => {
        const res = await request(app)
            .post(`/api/packages/${packageId}/reviews`)
            .set('x-auth-token', userToken)
            .send({
                rating: 4,
                comment: 'Great trip!'
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message');
    });

    it('should require rating', async () => {
        const res = await request(app)
            .post(`/api/packages/${packageId}/reviews`)
            .set('x-auth-token', userToken)
            .send({
                comment: 'Forgot rating'
            });
            
        expect(res.statusCode).toEqual(400);
    });

    it('should get reviews for a package', async () => {
        const res = await request(app)
            .get(`/api/packages/${packageId}/reviews`);
            
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toEqual(1);
        expect(res.body[0].rating).toEqual(4);
        expect(res.body[0].comment).toEqual('Great trip!');
        expect(res.body[0].fullname).toEqual('Review Tester'); // Check join works
    });
});
