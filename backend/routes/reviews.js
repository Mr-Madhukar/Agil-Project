const express = require('express');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ package_id: req.params.packageId })
            .populate('user_id', 'fullname username')
            .sort({ created_at: -1 });

        const mappedReviews = reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            fullname: r.user_id ? r.user_id.fullname : 'Unknown',
            username: r.user_id ? r.user_id.username : 'Unknown'
        }));

        res.status(200).json(mappedReviews);
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching reviews' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { rating, comment } = req.body;
    const user_id = req.user.id;
    const package_id = req.params.packageId;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating between 1 and 5 is required' });
    }

    try {
        const review = new Review({ package_id, user_id, rating, comment: comment || '' });
        await review.save();
        res.status(201).json({ message: 'Review added successfully', reviewId: review.id });
    } catch (err) {
        res.status(500).json({ error: 'Database error creating review' });
    }
});

module.exports = router;
