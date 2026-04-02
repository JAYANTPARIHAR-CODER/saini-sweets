const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();   // load .env file
connectDB();       // connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// All Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/contact',  require('./routes/contactRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));
app.use(express.urlencoded({ extended: true })); // ← add this

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});