const request = require('supertest');
const app = require('../app');
const db = require('../config/database');

// Ensure tests use an isolated in-memory db logic
beforeAll(() => {
    process.env.NODE_ENV = 'test';
});

afterAll((done) => {
    db.close();
    done();
});

describe('Sprint 0: Setup and Health Check', () => {
    it('should return 200 for health check', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'API is running');
    });
});
