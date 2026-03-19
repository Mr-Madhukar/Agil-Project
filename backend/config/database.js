const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

let mongoServer;

const connectDB = async () => {
    let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gotrip';
    
    if (process.env.NODE_ENV === 'test') {
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
    }

    try {
        await mongoose.connect(uri);
        console.log(`Connected to MongoDB (${process.env.NODE_ENV === 'test' ? 'test' : 'development'}).`);
        
        if (process.env.NODE_ENV !== 'test') {
            const Package = require('../models/Package');
            const count = await Package.countDocuments();
            if (count === 0) {
                const seedPackages = [
                    { destination: 'Canada', duration: '5 Days', price_inr: '₹1,99,999', price_usd: '$2,382', rating: 4.9, category: 'Americas' },
                    { destination: 'Paris', duration: '4 Days', price_inr: '₹1,49,999', price_usd: '$1,786', rating: 4.8, category: 'Europe' }
                ];
                await Package.insertMany(seedPackages);
            }
        }
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
};

connectDB();

module.exports = {
    connection: mongoose.connection,
    closeDatabase: async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    },
    clearDatabase: async () => {
        if (mongoose.connection.readyState !== 0) {
            const collections = mongoose.connection.collections;
            for (const key in collections) {
                await collections[key].deleteMany();
            }
        }
    }
};
