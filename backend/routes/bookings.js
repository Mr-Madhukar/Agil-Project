const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', authMiddleware, (req, res) => {
    const { package_id, travel_date, travelers } = req.body;
    const user_id = req.user.id;

    if (!package_id || !travel_date) {
        return res.status(400).json({ error: 'Package ID and Travel Date are required' });
    }

    db.run(
        'INSERT INTO bookings (user_id, package_id, travel_date, travelers) VALUES (?, ?, ?, ?)',
        [user_id, package_id, travel_date, travelers || 1],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error creating booking' });
            }
            res.status(201).json({ message: 'Booking created successfully', bookingId: this.lastID });
        }
    );
});

// @route   GET /api/bookings/user/:id
// @desc    Get all bookings for a user
// @access  Private
router.get('/user/:id', authMiddleware, (req, res) => {
    // Only the user themselves or an admin can access this
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const query = `
        SELECT b.id, b.travel_date, b.travelers, b.status, b.booking_date, 
               p.destination, p.duration, p.price_inr
        FROM bookings b
        JOIN packages p ON b.package_id = p.id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
    `;

    db.all(query, [req.params.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error fetching bookings' });
        }
        res.status(200).json(rows);
    });
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', authMiddleware, (req, res) => {
    // Need to verify if the booking belongs to the current user (or if admin)
    db.get('SELECT user_id FROM bookings WHERE id = ?', [req.params.id], (err, booking) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to cancel this booking' });
        }

        db.run('UPDATE bookings SET status = "Cancelled" WHERE id = ?', [req.params.id], function(err) {
            if (err) return res.status(500).json({ error: 'Failed to cancel booking' });
            res.status(200).json({ message: 'Booking cancelled successfully' });
        });
    });
});

module.exports = router;
