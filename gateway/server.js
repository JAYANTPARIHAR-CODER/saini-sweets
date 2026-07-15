const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// ─── 1. Logging ──────────────────────────────
app.use(morgan('dev'));

app.use(cors());

// ─── 2. Rate Limiting ────────────────────────
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: "Too many requests, please try again in a minute." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// ─── 3. Routing / Proxying ───────────────────
app.use('/api', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: { '^/': '/api/' },   // ← add this line
}));

app.get('/health', (req, res) => {
    res.json({ status: 'Gateway is running', forwardingTo: BACKEND_URL });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚪 API Gateway running on port ${PORT}, forwarding to ${BACKEND_URL}`);
});