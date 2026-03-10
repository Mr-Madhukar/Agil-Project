const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin only.' });
    }
};

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', [authMiddleware, adminAuth], (req, res) => {
    db.all('SELECT id, fullname, username, email, role FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error fetching users' });
        }
        res.status(200).json(rows);
    });
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings globally
// @access  Private/Admin
router.get('/bookings', [authMiddleware, adminAuth], (req, res) => {
    const query = `
        SELECT b.id, b.travel_date, b.travelers, b.status, b.booking_date, 
               p.destination, p.price_inr, u.fullname as user_fullname, u.email as user_email
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        JOIN users u ON b.user_id = u.id
        ORDER BY b.booking_date DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error fetching bookings' });
        }
        res.status(200).json(rows);
    });
});

module.exports = router;
