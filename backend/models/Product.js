const mongoose = require('mongoose');

// Schema = the blueprint/shape of a Product
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true  // must have a name — can't save without it
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,  // we store the image URL as text
    },
    description: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true  // by default every product is available
    }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

// Create the Model from the Schema
// "Product" → MongoDB will create a collection called "products"
const Product = mongoose.model('Product', productSchema);

module.exports = Product;