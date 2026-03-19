const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/:id', authMiddleware, async (req, res) => {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
    }

    try {
        const user = await User.findById(req.params.id).select('fullname username email role');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
