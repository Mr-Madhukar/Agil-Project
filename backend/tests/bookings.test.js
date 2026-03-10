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
    await new Promise((resolve) => db.run("DELETE FROM bookings", resolve));
    await new Promise((resolve) => db.run("DELETE FROM packages", resolve));
    await new Promise((resolve) => db.run("DELETE FROM users", resolve));

    // Seed User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await new Promise((resolve) => {
        db.run(
            'INSERT INTO users (fullname, username, email, password_hash) VALUES (?, ?, ?, ?)',
            ['Booking Tester', 'booktest', 'book@example.com', hashedPassword],
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
            ['Test Dest', '3 Days', '100', '1', 5],
            function(err) {
                packageId = this.lastID;
                resolve();
            }
        );
    });

    // Login User
    const res = await request(app).post('/api/auth/login').send({ email: 'book@example.com', password: 'password123' });
    userToken = res.body.token;
});

afterAll((done) => {
    db.close();
    done();
});

describe('Bookings API', () => {
    let bookingId;

    it('should create a new booking', async () => {
        const res = await request(app)
            .post('/api/bookings')
            .set('x-auth-token', userToken)
            .send({
                package_id: packageId,
                travel_date: '2027-01-01',
                travelers: 2
            });
            
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message');
        bookingId = res.body.bookingId;
    });

    it('should get booking history for user', async () => {
        const res = await request(app)
            .get(`/api/bookings/user/${userId}`)
            .set('x-auth-token', userToken);
            
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toEqual(1);
        expect(res.body[0].destination).toEqual('Test Dest');
    });

    it('should cancel a booking', async () => {
        const res = await request(app)
            .put(`/api/bookings/${bookingId}/cancel`)
            .set('x-auth-token', userToken);
            
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');

        // Verify it was cancelled
        const historyRes = await request(app)
            .get(`/api/bookings/user/${userId}`)
            .set('x-auth-token', userToken);
        expect(historyRes.body[0].status).toEqual('Cancelled');
    });
});
