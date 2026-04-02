const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, logoutUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);       // public
router.post('/login',    loginUser);          // public
router.get('/profile',   protect, getProfile); // protected ← needs token
router.post('/logout', logoutUser); // public

module.exports = router;