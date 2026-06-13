// ============================================================
// aiService.js — The AI Brain of Saini Sweets
// Now powered by Google Gemini (FREE!)
//
// This file talks to Google Gemini AI to:
// 1. Get sweet recommendations based on weather + festival
// 2. Answer customer chat questions about sweets
// ============================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Create one Gemini client using our API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We use gemini-2.0-flash — it's FREE and very fast!
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// ============================================================
// FUNCTION 1: getAIRecommendations
// Takes: weather (string), festival (string), menuItems (array)
// Returns: { recommendations: [...], message: "..." }
// ============================================================
const getAIRecommendations = async (weather, festival, menuItems) => {

    // Build the menu list as a text string to send to Gemini
    const menuList = menuItems.map(item =>
        `${item.name} (Category: ${item.category}) - Rs.${item.price} - ${item.description || 'No description'}`
    ).join('\n');

    // The prompt we send to Gemini
    const prompt = `You are a warm and helpful assistant for Saini Sweets, a famous sweet shop in Hisar, Haryana, India.

Current weather: ${weather}
Upcoming or current festival: ${festival}

Our available menu items:
${menuList}

Based on the current weather and festival, please recommend exactly 3 items from our menu above.
For each item, write ONE short and friendly sentence explaining why it's perfect for this weather/festival.

IMPORTANT: Only recommend items that are EXACTLY in our menu list above. Do not make up new items.

Respond in this exact JSON format (no extra text before or after, no markdown):
{
    "recommendations": [
        {
            "name": "exact item name from menu",
            "reason": "one friendly sentence why it's perfect"
        },
        {
            "name": "exact item name from menu",
            "reason": "one friendly sentence why it's perfect"
        },
        {
            "name": "exact item name from menu",
            "reason": "one friendly sentence why it's perfect"
        }
    ],
    "message": "A warm 1-2 sentence greeting mentioning the weather and festival"
}`;

    // Call Gemini
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean up response (remove markdown code blocks if present)
    const cleaned = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

    // Parse JSON and return
    const parsed = JSON.parse(cleaned);
    return parsed;
};

// ============================================================
// FUNCTION 2: getChatResponse
// Takes: userMessage (string), menuItems (array)
// Returns: string (AI reply to the customer)
// ============================================================
const getChatResponse = async (userMessage, menuItems) => {

    // Build menu list for context
    const menuList = menuItems.map(item =>
        `${item.name} (${item.category}) - Rs.${item.price} - ${item.description || ''}`
    ).join('\n');

    const prompt = `You are a friendly customer service assistant for Saini Sweets in Hisar, Haryana, India.
We sell traditional Indian sweets and snacks.

Our current menu:
${menuList}

A customer is asking: "${userMessage}"

Reply in 2-3 short, friendly sentences.
- Suggest specific items from our menu when relevant.
- Keep it conversational and warm, like a helpful shop assistant.
- If asked about something we don't have, politely say so and suggest alternatives from our menu.
- Do NOT use bullet points, just natural sentences.`;

    // Call Gemini
    const result = await model.generateContent(prompt);
    return result.response.text();
};

// Export both functions so controllers can use them
module.exports = { getAIRecommendations, getChatResponse };
