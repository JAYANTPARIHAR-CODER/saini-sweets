const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();

// ─────────────────────────────────────────────
// BACKEND SERVERS
// ─────────────────────────────────────────────

const BACKENDS = [
    process.env.BACKEND_URL_1,
    process.env.BACKEND_URL_2
].filter(Boolean);

// Make sure at least one backend is configured
if (BACKENDS.length === 0) {
    console.error('❌ No backend URLs configured.');
    process.exit(1);
}

console.log('⚖️ Configured backends:');
BACKENDS.forEach((backend, index) => {
    console.log(`   Backend ${index + 1}: ${backend}`);
});

// Round-robin counter
let currentBackend = 0;


// ─────────────────────────────────────────────
// 1. LOGGING
// ─────────────────────────────────────────────

app.use(morgan('dev'));


// ─────────────────────────────────────────────
// 2. CORS
// ─────────────────────────────────────────────

app.use(cors());


// ─────────────────────────────────────────────
// 3. RATE LIMITING
// ─────────────────────────────────────────────

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,

    message: {
        error: 'Too many requests, please try again in a minute.'
    },

    standardHeaders: true,
    legacyHeaders: false
});

app.use(limiter);


// ─────────────────────────────────────────────
// 4. LOAD BALANCER + API PROXY
// ─────────────────────────────────────────────

app.use(
    '/api',

    createProxyMiddleware({

        // Default target
        target: BACKENDS[0],

        changeOrigin: true,

        // Choose backend using Round Robin
        router: () => {

            const backendIndex = currentBackend;

            const target = BACKENDS[backendIndex];

            console.log(
                `⚖️ Load Balancer → Backend ${backendIndex + 1}`
            );

            // Move to next backend
            currentBackend =
                (currentBackend + 1) % BACKENDS.length;

            return target;
        },

        // /products → /api/products
        pathRewrite: {
            '^/': '/api/'
        },

        // Handle backend errors
        onError: (err, req, res) => {

            console.error(
                '❌ Backend Proxy Error:',
                err.message
            );

            if (!res.headersSent) {

                res.status(502).json({
                    error: 'Backend server unavailable'
                });

            }
        }
    })
);


// ─────────────────────────────────────────────
// 5. HEALTH CHECK
// ─────────────────────────────────────────────

app.get('/health', (req, res) => {

    res.json({
        status: 'Gateway is running',

        loadBalancer: 'Round Robin',

        backendCount: BACKENDS.length,

        backends: BACKENDS.map(
            (_, index) => `Backend ${index + 1}`
        )
    });

});


// ─────────────────────────────────────────────
// 6. START SERVER
// ─────────────────────────────────────────────

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {

    console.log(
        `🚪 API Gateway running on port ${PORT}`
    );

    console.log(
        `⚖️ Load Balancer: Round Robin`
    );

    BACKENDS.forEach((backend, index) => {

        console.log(
            `🔵 Backend ${index + 1}: ${backend}`
        );

    });

});