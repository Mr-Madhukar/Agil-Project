const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

let userToken;
let userId;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connection.asPromise();
    await db.clearDatabase();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const user = await User.create({ fullname: 'Profile Tester', username: 'profileuser', email: 'profile@example.com', password_hash: hashedPassword });
    userId = user.id;

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'profile@example.com',
            password: 'password123'
        });
    userToken = res.body.token;
});

afterAll(async () => {
    await db.closeDatabase();
});

describe('Profile API', () => {
    it('should get the logged-in user profile', async () => {
        const res = await request(app)
            .get(`/api/profile/${userId}`)
            .set('x-auth-token', userToken);
            
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email', 'profile@example.com');
        expect(res.body).toHaveProperty('fullname', 'Profile Tester');
        expect(res.body).not.toHaveProperty('password_hash');
    });

    it('should return 401 if no token provided', async () => {
        const res = await request(app)
            .get(`/api/profile/${userId}`);
            
        expect(res.statusCode).toEqual(401);
    });

    it('should return 403 if trying to access another user profile without admin rights', async () => {
        // use fake objectid
        const fakeId = new mongoose.Types.ObjectId().toString();
        const res = await request(app)
            .get(`/api/profile/${fakeId}`) 
            .set('x-auth-token', userToken);
            
        expect(res.statusCode).toEqual(403);
    });
});
