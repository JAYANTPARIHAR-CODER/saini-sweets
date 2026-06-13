// ============================================================
// aiService.js — The AI Brain of Saini Sweets
// Now powered by Groq (100% FREE + Super Fast!)
//
// Groq uses LLaMA 3 model (made by Meta/Facebook)
// It's the fastest AI API available — responses in <1 second!
//
// This file does two things:
// 1. Get sweet recommendations based on weather + festival
// 2. Answer customer chat questions about sweets
// ============================================================

const Groq = require('groq-sdk');

// Create Groq client using API key from .env
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// We use llama-3.3-70b-versatile — very powerful and free!
const MODEL = 'llama-3.3-70b-versatile';

// ============================================================
// FUNCTION 1: getAIRecommendations
// Takes: weather (string), festival (string), menuItems (array)
// Returns: { recommendations: [...], message: "..." }
// ============================================================
const getAIRecommendations = async (weather, festival, menuItems) => {

    // Build the menu list as a text string to send to AI
    const menuList = menuItems.map(item =>
        `${item.name} (Category: ${item.category}) - Rs.${item.price} - ${item.description || 'Traditional Indian sweet'}`
    ).join('\n');

    // The prompt we send to Groq/LLaMA
    const prompt = `You are a warm and helpful assistant for Saini Sweets, a famous sweet shop in Hisar, Haryana, India.

Current weather: ${weather}
Upcoming or current festival: ${festival}

Our available menu items:
${menuList}

Based on the current weather and festival, please recommend exactly 3 items from our menu above.
For each item, write ONE short and friendly sentence explaining why it's perfect for this weather/festival.

IMPORTANT RULES:
- Only recommend items that EXACTLY appear in our menu list above
- Do not make up new items
- Respond ONLY with valid JSON — no extra text, no markdown, no code blocks

Respond in this exact JSON format:
{
    "recommendations": [
        {
            "name": "exact item name from menu",
            "reason": "one friendly sentence why it is perfect"
        },
        {
            "name": "exact item name from menu",
            "reason": "one friendly sentence why it is perfect"
        },
        {
            "name": "exact item name from menu",
            "reason": "one friendly sentence why it is perfect"
        }
    ],
    "message": "A warm 1-2 sentence greeting mentioning the weather and festival"
}`;

    // Call Groq AI
    const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: 1024,
        temperature: 0.7,
        // Tell Groq we want JSON back
        response_format: { type: 'json_object' }
    });

    // Get the response text
    const responseText = completion.choices[0].message.content;

    // Parse JSON and return
    const parsed = JSON.parse(responseText);
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
        `${item.name} (${item.category}) - Rs.${item.price} - ${item.description || 'Traditional Indian sweet'}`
    ).join('\n');

    const prompt = `You are a friendly customer service assistant for Saini Sweets in Hisar, Haryana, India.
We sell traditional Indian sweets and snacks.

Our current menu:
${menuList}

A customer is asking: "${userMessage}"

Reply in 2-3 short, friendly sentences.
- Suggest specific items from our menu when relevant
- Keep it conversational and warm, like a helpful shop assistant
- If asked about something we do not have, politely say so and suggest alternatives from our menu
- Do NOT use bullet points, just natural sentences`;

    // Call Groq AI
    const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: 500,
        temperature: 0.8
    });

    return completion.choices[0].message.content;
};

// Export both functions so controllers can use them
module.exports = { getAIRecommendations, getChatResponse };
