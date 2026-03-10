const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        // Check if user already exists
        db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error while checking user' });
            }
            if (user) {
                return res.status(400).json({ error: 'User with that email or username already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert into DB
            db.run(
                'INSERT INTO users (fullname, username, email, password_hash) VALUES (?, ?, ?, ?)',
                [fullname, username, email, hashedPassword],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to create user' });
                    }
                    res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user & get token
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during login' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token,
                    user: {
                        id: user.id,
                        fullname: user.fullname,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );
    });
});

module.exports = router;
