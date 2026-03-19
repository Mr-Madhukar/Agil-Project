const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

let adminToken;
let userToken;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connection.asPromise();
    await db.clearDatabase();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.create({ fullname: 'Admin User', username: 'admin', email: 'admin@example.com', password_hash: hashedPassword, role: 'admin' });
    await User.create({ fullname: 'Normal User', username: 'normal', email: 'normal@example.com', password_hash: hashedPassword, role: 'traveler' });

    const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminRes.body.token;

    const userRes = await request(app).post('/api/auth/login').send({ email: 'normal@example.com', password: 'password123' });
    userToken = userRes.body.token;
});

afterAll(async () => {
    await db.closeDatabase();
});

describe('Admin API', () => {
    it('should get all users if admin', async () => {
        const res = await request(app)
            .get('/api/admin/users')
            .set('x-auth-token', adminToken);
            
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThanOrEqual(2);
        expect(res.body[0]).not.toHaveProperty('password_hash');
    });

    it('should deny users access if not admin', async () => {
        const res = await request(app)
            .get('/api/admin/users')
            .set('x-auth-token', userToken);
            
        expect(res.statusCode).toEqual(403);
    });

    it('should get all bookings if admin', async () => {
        const res = await request(app)
            .get('/api/admin/bookings')
            .set('x-auth-token', adminToken);
            
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should deny bookings access if not admin', async () => {
        const res = await request(app)
            .get('/api/admin/bookings')
            .set('x-auth-token', userToken);
            
        expect(res.statusCode).toEqual(403);
    });
});
