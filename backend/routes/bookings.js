const express = require('express');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
    const { package_id, travel_date, travelers } = req.body;
    const user_id = req.user.id;

    if (!package_id || !travel_date) {
        return res.status(400).json({ error: 'Package ID and Travel Date are required' });
    }

    try {
        const booking = new Booking({ user_id, package_id, travel_date, travelers: travelers || 1 });
        await booking.save();
        res.status(201).json({ message: 'Booking created successfully', bookingId: booking.id });
    } catch (err) {
        res.status(500).json({ error: 'Database error creating booking' });
    }
});

router.get('/user/:id', authMiddleware, async (req, res) => {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        const bookings = await Booking.find({ user_id: req.params.id })
            .populate('package_id', 'destination duration price_inr')
            .sort({ booking_date: -1 });

        const mappedBookings = bookings.map(b => ({
            id: b.id,
            travel_date: b.travel_date,
            travelers: b.travelers,
            status: b.status,
            booking_date: b.booking_date,
            destination: b.package_id ? b.package_id.destination : 'Unknown',
            duration: b.package_id ? b.package_id.duration : 'Unknown',
            price_inr: b.package_id ? b.package_id.price_inr : '0'
        }));

        res.status(200).json(mappedBookings);
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching bookings' });
    }
});

router.put('/:id/cancel', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        if (booking.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized to cancel this booking' });
        }

        booking.status = 'Cancelled';
        await booking.save();
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

module.exports = router;
