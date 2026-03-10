const request = require('supertest');
const app = require('../app');
const db = require('../config/database');

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    
    // Clean packages
    await new Promise((resolve) => db.run("DELETE FROM packages", resolve));

    // Seed one package for tests
    await new Promise((resolve) => {
        db.run(
            'INSERT INTO packages (destination, duration, price_inr, price_usd, rating, category) VALUES (?, ?, ?, ?, ?, ?)',
            ['Test Destination', '3 Days', '₹50,000', '$600', 4.5, 'TestCategory'],
            resolve
        );
    });
});

afterAll((done) => {
    db.close();
    done();
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
