const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin only.' });
    }
};

router.get('/users', [authMiddleware, adminAuth], async (req, res) => {
    try {
        const users = await User.find().select('fullname username email role');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching users' });
    }
});

router.get('/bookings', [authMiddleware, adminAuth], async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('package_id', 'destination price_inr')
            .populate('user_id', 'fullname email')
            .sort({ booking_date: -1 });

        // Map Mongoose output to match SQL JOIN structure
        const mappedBookings = bookings.map(b => ({
            id: b.id,
            travel_date: b.travel_date,
            travelers: b.travelers,
            status: b.status,
            booking_date: b.booking_date,
            destination: b.package_id ? b.package_id.destination : 'Unknown',
            price_inr: b.package_id ? b.package_id.price_inr : '0',
            user_fullname: b.user_id ? b.user_id.fullname : 'Unknown',
            user_email: b.user_id ? b.user_id.email : 'Unknown'
        }));

        res.status(200).json(mappedBookings);
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching bookings' });
    }
});

module.exports = router;
