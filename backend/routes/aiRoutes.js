// ============================================================
// aiRoutes.js — Defines the URL paths for AI features
//
// GET  /api/ai/recommendations  → AI suggests sweets by weather/festival
// POST /api/ai/chat             → AI answers customer questions
// ============================================================

const express = require('express');
const router = express.Router();

// Import our controller functions
const { getRecommendations, chat } = require('../controllers/aiController');

// Route 1: GET recommendations based on weather and festival
// Frontend calls: GET /api/ai/recommendations?weather=hot&festival=Diwali
router.get('/recommendations', getRecommendations);

// Route 2: POST a chat message
// Frontend calls: POST /api/ai/chat  with body { message: "..." }
router.post('/chat', chat);

module.exports = router;
