const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/',       getProducts);
router.get('/:id',    getProductById);

// ← wrap upload in error handler
router.post('/', protect, adminOnly, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, createProduct);

router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
