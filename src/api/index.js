import axios from 'axios';

// This is the base URL of your backend
// In development → set VITE_API_URL=http://localhost:5000/api in .env
// In production  → uses the Render deployed URL by default
const BASE_URL = import.meta.env.VITE_API_URL || 'https://saini-sweets-gateway.onrender.com/api';

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
// Payment (Razorpay)
export const createPaymentOrder = (amount) => API.post('/payment/create-order', { amount });
export const verifyPayment = (data) => API.post('/payment/verify-payment', data);

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