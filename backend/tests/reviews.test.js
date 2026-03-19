const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const mongoose = require('mongoose');
const User = require('../models/User');
const Package = require('../models/Package');
const bcrypt = require('bcryptjs');

let userToken;
let userId;
let packageId;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connection.asPromise();
    await db.clearDatabase();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const user = await User.create({ fullname: 'Review Tester', username: 'revtest', email: 'rev@example.com', password_hash: hashedPassword });
    userId = user.id;

    const pkg = await Package.create({ destination: 'Review Dest', duration: '3 Days', price_inr: '100', price_usd: '1', rating: 5 });
    packageId = pkg.id;

    const res = await request(app).post('/api/auth/login').send({ email: 'rev@example.com', password: 'password123' });
    userToken = res.body.token;
});

afterAll(async () => {
    await db.closeDatabase();
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
        expect(res.body[0].fullname).toEqual('Review Tester'); 
    });
});
