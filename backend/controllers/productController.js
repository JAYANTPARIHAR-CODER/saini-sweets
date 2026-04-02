const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

// GET all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET one product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST create product WITH image
const createProduct = async (req, res) => {
    try {
        // Debug — check what's coming in
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const { name, price, category, description } = req.body;
        const imageUrl = req.file ? req.file.path : '';

        // Check manually if fields exist
        if (!name || !price || !category) {
            return res.status(400).json({ 
                error: "Name, price and category are required!",
                receivedBody: req.body  // shows what was received
            });
        }

        const product = await Product.create({
            name,
            price: Number(price),
            category,
            description,
            image: imageUrl
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE product + delete image from Cloudinary
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Delete image from Cloudinary if it exists
        if (product.image) {
            // Extract public_id from URL
            const publicId = product.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`saini-sweets/${publicId}`);
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct };