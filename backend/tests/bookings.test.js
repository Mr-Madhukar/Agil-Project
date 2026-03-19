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
    
    const user = await User.create({ fullname: 'Booking Tester', username: 'booktest', email: 'book@example.com', password_hash: hashedPassword });
    userId = user.id;

    const pkg = await Package.create({ destination: 'Test Dest', duration: '3 Days', price_inr: '100', price_usd: '1', rating: 5 });
    packageId = pkg.id;

    const res = await request(app).post('/api/auth/login').send({ email: 'book@example.com', password: 'password123' });
    userToken = res.body.token;
});

afterAll(async () => {
    await db.closeDatabase();
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

        const historyRes = await request(app)
            .get(`/api/bookings/user/${userId}`)
            .set('x-auth-token', userToken);
        expect(historyRes.body[0].status).toEqual('Cancelled');
    });
});
