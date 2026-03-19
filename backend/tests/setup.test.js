const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const mongoose = require('mongoose');

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connection.asPromise();
});

afterAll(async () => {
    await db.closeDatabase();
});

describe('Sprint 0: Setup and Health Check', () => {
    it('should return 200 for health check', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'API is running');
    });
});
