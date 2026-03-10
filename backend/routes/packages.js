const express = require('express');
const db = require('../config/database');

const router = express.Router();

// @route   GET /api/packages
// @desc    Get all travel packages (optional ?category= filter)
// @access  Public
router.get('/', (req, res) => {
    const category = req.query.category;
    
    let query = 'SELECT * FROM packages';
    let params = [];

    if (category && category.toLowerCase() !== 'all') {
        query += ' WHERE category = ?';
        params.push(category);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error fetching packages' });
        }
        res.status(200).json(rows);
    });
});

module.exports = router;
