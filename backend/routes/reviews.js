const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true }); // mergeParams allows accessing /api/packages/:packageId/reviews

// @route   GET /api/packages/:packageId/reviews
// @desc    Get all reviews for a package
// @access  Public
router.get('/', (req, res) => {
    const query = `
        SELECT r.id, r.rating, r.comment, r.created_at, u.fullname, u.username
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.package_id = ?
        ORDER BY r.created_at DESC
    `;

    db.all(query, [req.params.packageId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error fetching reviews' });
        }
        res.status(200).json(rows);
    });
});

// @route   POST /api/packages/:packageId/reviews
// @desc    Add a review for a package
// @access  Private
router.post('/', authMiddleware, (req, res) => {
    const { rating, comment } = req.body;
    const user_id = req.user.id;
    const package_id = req.params.packageId;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating between 1 and 5 is required' });
    }

    // Optional: Check if user actually booked this package before letting them review (Business logic)
    // For now, we just let them review if they are logged in.

    db.run(
        'INSERT INTO reviews (package_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [package_id, user_id, rating, comment || ''],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error creating review' });
            }
            res.status(201).json({ message: 'Review added successfully', reviewId: this.lastID });
        }
    );
});

module.exports = router;
