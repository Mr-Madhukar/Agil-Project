const express = require('express');
const Package = require('../models/Package');

const router = express.Router();

router.get('/', async (req, res) => {
    const category = req.query.category;
    try {
        let query = {};
        if (category && category.toLowerCase() !== 'all') {
            query.category = category;
        }
        const packages = await Package.find(query);
        res.status(200).json(packages);
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching packages' });
    }
});

module.exports = router;
