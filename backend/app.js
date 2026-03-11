const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files from the parent directory
app.use(express.static(path.join(__dirname, '../')));

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const packagesRoutes = require('./routes/packages');
const adminRoutes = require('./routes/admin');
const bookingsRoutes = require('./routes/bookings');
const reviewsRoutes = require('./routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/packages/:packageId/reviews', reviewsRoutes);

// Basic testing route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

module.exports = app;
