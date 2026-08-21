const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const redis = require("./src/config/redis");
const cors = require('cors');

const connectDB = require('./config/db');

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// All Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/contact',  require('./routes/contactRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));
app.use('/api/ai',       require('./routes/aiRoutes'));  
app.use('/api/payment', require('./routes/paymentRoutes'));  // ← Payment routes
app.use(express.urlencoded({ extended: true })); // ← add this

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
