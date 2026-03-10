const express = require('express');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profile/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', authMiddleware, (req, res) => {
    // Ensure the user is requesting their own profile or is an admin
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
    }

    db.get('SELECT id, fullname, username, email, role FROM users WHERE id = ?', [req.params.id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    });
});

module.exports = router;
