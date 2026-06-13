import axios from 'axios';

// This is the base URL of your backend
// In development → uses localhost:5000
// In production  → uses the Render deployed URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
    baseURL: BASE_URL
});

// Products
export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);

// Contact
export const sendContact = (data) => API.post('/contact', data);

// Orders
export const placeOrder = (data) => API.post('/orders', data);

// User Authentication
export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const logoutUser = (data) => API.post('/users/logout', data);

// ─── AI Features ─────────────────────────────────────────────
// Gets 3 sweet recommendations based on current weather + festival
export const getAIRecommendations = (weather, festival) =>
    API.get(`/ai/recommendations?weather=${encodeURIComponent(weather)}&festival=${encodeURIComponent(festival)}`);

// Sends a chat message to the AI assistant
export const sendChatMessage = (message) =>
    API.post('/ai/chat', { message });