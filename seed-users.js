const db = require('./backend/config/database');
const bcrypt = require('bcryptjs');

async function seed() {
    const saltAdmin = await bcrypt.genSalt(10);
    const hashAdmin = await bcrypt.hash('admin123', saltAdmin);
    
    // Create Admin
    db.run(`INSERT INTO users (fullname, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
        ['System Admin', 'administrator', 'admin@gotrip.com', hashAdmin, 'admin'], (err) => {
        if(err) console.log('Admin already exists or error:', err.message);
        else console.log('Admin User Created: admin@gotrip.com / admin123');
    });

    // Create Normal User
    const saltUser = await bcrypt.genSalt(10);
    const hashUser = await bcrypt.hash('user123', saltUser);
    
    db.run(`INSERT INTO users (fullname, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
        ['Test Traveler', 'traveler99', 'user@example.com', hashUser, 'traveler'], (err) => {
        if(err) console.log('Normal user already exists or error:', err.message);
        else {
            console.log('Normal User Created: user@example.com / user123');
            db.close();
            console.log('Seeding complete. You can now login.');
        }
    });
}

seed();
