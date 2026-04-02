import axios from 'axios';

// This is the base URL of your backend
// Instead of typing full URL every time, we set it once here
const API = axios.create({
    baseURL: 'http://localhost:5000/api'
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