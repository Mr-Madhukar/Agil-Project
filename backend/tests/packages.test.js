const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const mongoose = require('mongoose');
const Package = require('../models/Package');

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connection.asPromise();
    await db.clearDatabase();

    await Package.create({ destination: 'Test Destination', duration: '3 Days', price_inr: '₹50,000', price_usd: '$600', rating: 4.5, category: 'TestCategory' });
});

afterAll(async () => {
    await db.closeDatabase();
});

describe('Packages API', () => {
    it('should get all packages', async () => {
        const res = await request(app).get('/api/packages');
            
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0]).toHaveProperty('destination', 'Test Destination');
    });

    it('should filter packages by category', async () => {
        const res = await request(app).get('/api/packages?category=TestCategory');
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);

        const res2 = await request(app).get('/api/packages?category=NonExistent');
        expect(res2.statusCode).toEqual(200);
        expect(res2.body.length).toEqual(0);
    });
});
