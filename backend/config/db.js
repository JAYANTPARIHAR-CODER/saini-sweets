// Import mongoose — this is the package that talks to MongoDB
const mongoose = require('mongoose');

// This function connects to MongoDB
const connectDB = async () => {
    try {
        // process.env.MONGO_URI → reads from your .env file (secret connection string)
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        process.exit(1); // stop the server if DB connection fails
    }
};

module.exports = connectDB;