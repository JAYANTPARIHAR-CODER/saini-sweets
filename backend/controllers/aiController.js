// ============================================================
// aiController.js — Handles the HTTP requests for AI features
// This receives requests from frontend, calls aiService,
// and sends back the response.
// ============================================================

const { getAIRecommendations, getChatResponse } = require('../services/aiService');
const Product = require('../models/Product');

// ============================================================
// CONTROLLER 1: getRecommendations
// Route: GET /api/ai/recommendations?weather=hot&festival=Diwali
// What it does:
//   1. Gets weather and festival from query params
//   2. Loads all products from MongoDB
//   3. Asks AI for recommendations
//   4. Returns the recommendations
// ============================================================
const getRecommendations = async (req, res) => {
    try {
        // Step 1: Get weather and festival from URL query
        // Example: /api/ai/recommendations?weather=hot&festival=Diwali
        const { weather, festival } = req.query;

        // Step 2: Load all available products from MongoDB
        const products = await Product.find({ isAvailable: true });

        // If no products in DB, return helpful error
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No products found in database. Please add products first!"
            });
        }

        // Step 3: Call our AI service
        const recommendations = await getAIRecommendations(
            weather || 'normal weather',
            festival || 'regular day',
            products
        );

        // Step 4: Send recommendations back to frontend
        res.json({
            success: true,
            data: recommendations,
            meta: {
                weather: weather || 'normal weather',
                festival: festival || 'regular day',
                totalProducts: products.length
            }
        });

    } catch (error) {
        console.error('AI Recommendation Error:', error.message);
        res.status(500).json({
            success: false,
            error: "AI recommendation failed: " + error.message
        });
    }
};

// ============================================================
// CONTROLLER 2: chat
// Route: POST /api/ai/chat
// Body: { message: "What sweets are good for Diwali?" }
// What it does:
//   1. Gets the customer's message from request body
//   2. Loads all products for context
//   3. Asks AI to reply
//   4. Returns the AI's reply
// ============================================================
const chat = async (req, res) => {
    try {
        // Step 1: Get message from request body
        const { message } = req.body;

        // Validate — message is required
        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                error: "Message is required!"
            });
        }

        // Step 2: Load products so AI knows our menu
        const products = await Product.find({ isAvailable: true });

        // Step 3: Get AI response
        const response = await getChatResponse(message, products);

        // Step 4: Send back to frontend
        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('AI Chat Error:', error.message);
        res.status(500).json({
            success: false,
            error: "Chat failed: " + error.message
        });
    }
};

module.exports = { getRecommendations, chat };
