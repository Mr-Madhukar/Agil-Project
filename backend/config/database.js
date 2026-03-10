const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Determine DB file based on environment
const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log(`Connected to the SQLite database (${process.env.NODE_ENV === 'test' ? 'in-memory' : 'file'}).`);
        
        db.serialize(() => {
            // Users Table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fullname TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'traveler'
            )`);

            // Packages Table
            db.run(`CREATE TABLE IF NOT EXISTS packages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                destination TEXT NOT NULL,
                duration TEXT NOT NULL,
                price_inr TEXT NOT NULL,
                price_usd TEXT NOT NULL,
                rating REAL DEFAULT 0,
                description TEXT,
                image_url TEXT,
                category TEXT
            )`);

            // Bookings Table
            db.run(`CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                package_id INTEGER NOT NULL,
                booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                travel_date TEXT NOT NULL,
                travelers INTEGER DEFAULT 1,
                status TEXT DEFAULT 'Confirmed',
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(package_id) REFERENCES packages(id)
            )`);

            // Reviews Table
            db.run(`CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                package_id INTEGER NOT NULL,
                rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(package_id) REFERENCES packages(id)
            )`);
            
            // Seed packages if not testing
            if (process.env.NODE_ENV !== 'test') {
                db.get("SELECT COUNT(*) AS count FROM packages", (err, row) => {
                    if (row && row.count === 0) {
                        const seedPackages = [
                            { d: 'Canada', dur: '5 Days', p_inr: '₹1,99,999', p_usd: '$2,382', r: 4.9, c: 'Americas' },
                            { d: 'Paris', dur: '4 Days', p_inr: '₹1,49,999', p_usd: '$1,786', r: 4.8, c: 'Europe' },
                            { d: 'Monaco', dur: '4 Days', p_inr: '₹1,39,999', p_usd: '$1,667', r: 4.7, c: 'Europe' },
                            { d: 'Switzerland', dur: '5 Days', p_inr: '₹1,59,999', p_usd: '$1,906', r: 4.9, c: 'Europe' },
                            { d: 'South Korea', dur: '4 Days', p_inr: '₹1,49,999', p_usd: '$1,787', r: 4.8, c: 'Asia' },
                            { d: 'Tokyo', dur: '5 Days', p_inr: '₹1,69,999', p_usd: '$2,024', r: 4.9, c: 'Asia' }
                        ];
                        
                        const stmt = db.prepare('INSERT INTO packages (destination, duration, price_inr, price_usd, rating, category) VALUES (?, ?, ?, ?, ?, ?)');
                        seedPackages.forEach(p => {
                            stmt.run([p.d, p.dur, p.p_inr, p.p_usd, p.r, p.c]);
                        });
                        stmt.finalize();
                        console.log("Seeded database with initial travel packages.");
                    }
                });
            }
        });
    }
});

module.exports = db;
