const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./backend/models/User');
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gotrip';

async function seed() {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB for seeding...');

        // Create Admin
        const saltAdmin = await bcrypt.genSalt(10);
        const hashAdmin = await bcrypt.hash('admin123', saltAdmin);
        
        const existingAdmin = await User.findOne({ email: 'admin@gotrip.com' });
        if (existingAdmin) {
            existingAdmin.password_hash = hashAdmin;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin User Updated: admin@gotrip.com / admin123');
        } else {
            const adminUser = new User({
                fullname: 'System Admin',
                username: 'administrator',
                email: 'admin@gotrip.com',
                password_hash: hashAdmin,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Admin User Created: admin@gotrip.com / admin123');
        }

        // Create Normal User
        const saltUser = await bcrypt.genSalt(10);
        const hashUser = await bcrypt.hash('user123', saltUser);
        
        const existingUser = await User.findOne({ email: 'user@example.com' });
        if (existingUser) {
            existingUser.password_hash = hashUser;
            await existingUser.save();
            console.log('Normal User Updated: user@example.com / user123');
        } else {
            const normalUser = new User({
                fullname: 'Test Traveler',
                username: 'traveler99',
                email: 'user@example.com',
                password_hash: hashUser,
                role: 'traveler'
            });
            await normalUser.save();
            console.log('Normal User Created: user@example.com / user123');
        }

        console.log('\nSeeding complete. You can now login as admin.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

seed();
