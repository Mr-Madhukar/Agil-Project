const request = require('supertest');
const app = require('../app');
const db = require('../config/database');
const bcrypt = require('bcryptjs');

let userToken;
let userId;

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    
    // Ensure clean state
    await new Promise((resolve) => db.run("DELETE FROM users", resolve));

    // Seed a user for profile tests
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await new Promise((resolve) => {
        db.run(
            'INSERT INTO users (fullname, username, email, password_hash) VALUES (?, ?, ?, ?)',
            ['Profile Tester', 'profileuser', 'profile@example.com', hashedPassword],
            function(err) {
                userId = this.lastID;
                resolve();
            }
        );
    });

    // Login to get token
    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'profile@example.com',
            password: 'password123'
        });
    userToken = res.body.token;
});

afterAll((done) => {
    db.close();
    done();
});

describe('Profile API', () => {
    it('should get the logged-in user profile', async () => {
        const res = await request(app)
            .get(`/api/profile/${userId}`)
            .set('x-auth-token', userToken);
            
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('email', 'profile@example.com');
        expect(res.body).toHaveProperty('fullname', 'Profile Tester');
        expect(res.body).not.toHaveProperty('password_hash'); // should not return password
    });

    it('should return 401 if no token provided', async () => {
        const res = await request(app)
            .get(`/api/profile/${userId}`);
            
        expect(res.statusCode).toEqual(401);
    });

    it('should return 403 if trying to access another user profile without admin rights', async () => {
        const res = await request(app)
            .get(`/api/profile/999`) // different ID
            .set('x-auth-token', userToken);
            
        expect(res.statusCode).toEqual(403);
    });
});
