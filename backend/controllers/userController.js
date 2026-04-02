const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },     // payload
        process.env.JWT_SECRET,                   // secret key
        { expiresIn: '7d' }                       // expires in 7 days
    );
};

// POST register → /api/users/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered!" });
        }

        // Encrypt password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with encrypted password
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Send back user info + token
        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user) // ← JWT token
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST login → /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        // Update lastLogin and isLoggedIn
        user.lastLogin = new Date();
        user.isLoggedIn = true;
        await user.save();

        // Send back user info + token
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user) // ← JWT token
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST logout → /api/users/logout
const logoutUser = async (req, res) => {
    try {
        const { id } = req.body;

        // Find user and update isLoggedIn
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        user.isLoggedIn = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User logged out successfully."
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET profile → /api/users/profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser, getProfile };