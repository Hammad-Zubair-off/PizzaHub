const mongoose = require('mongoose');
require('dotenv').config();

const connectWithDB = async () => {
    try {
        // Set mongoose options
        mongoose.set('strictQuery', false);
        
        // Set up mongoose connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000,
            family: 4
        };

        // Connect to MongoDB Atlas
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        console.log("✅ MongoDB Atlas connection successful");
        
        // Handle connection events
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error during MongoDB connection closure:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error.message);
        process.exit(1);
    }
};

module.exports = connectWithDB;
