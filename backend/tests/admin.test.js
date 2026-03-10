const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const bcrypt = require('bcryptjs');

let adminToken;
let userToken;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    
    // Ensure clean state
    await new Promise((resolve) => db.run("DELETE FROM users", resolve));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Seed an admin
    await new Promise((resolve) => {
        db.run(
            'INSERT INTO users (fullname, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            ['Admin User', 'admin', 'admin@example.com', hashedPassword, 'admin'],
            resolve
        );
    });

    // Seed a normal user
    await new Promise((resolve) => {
        db.run(
            'INSERT INTO users (fullname, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            ['Normal User', 'normal', 'normal@example.com', hashedPassword, 'traveler'],
            resolve
        );
    });

    // Login Admin
    const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'password123' });
    adminToken = adminRes.body.token;

    // Login Normal User
    const userRes = await request(app).post('/api/auth/login').send({ email: 'normal@example.com', password: 'password123' });
    userToken = userRes.body.token;
});

afterAll((done) => {
    db.close();
    done();
});

describe('Admin API', () => {
    it('should get all users if admin', async () => {
        const res = await request(app)
            .get('/api/admin/users')
            .set('x-auth-token', adminToken);
            
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThanOrEqual(2); // admin + normal user
        
        // Ensure password hashes are not sent
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
