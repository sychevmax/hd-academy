// Simple Node-based reverse proxy for local dev on macOS Big Sur (no Caddy needed)
// Routes:
//   /api/*  -> Spring Boot on http://localhost:8081
//   everything else -> CRA dev server on http://localhost:3000 (with HMR websockets)

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT_PROXY = process.env.PORT_PROXY || 8080;
const API_TARGET = process.env.API_TARGET || 'http://localhost:8081';
const UI_TARGET = process.env.UI_TARGET || 'http://localhost:3000';

const app = express();

// Proxy API first so it doesn't fall through
app.use(
  '/api',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    // preserve path under /api
    ws: true,
    logLevel: 'warn',
  })
);

// Everything else to CRA dev server (includes websocket upgrades for HMR)
app.use(
  '/',
  createProxyMiddleware({
    target: UI_TARGET,
    changeOrigin: true,
    ws: true,
    logLevel: 'warn',
  })
);

app.listen(PORT_PROXY, () => {
  console.log(`[dev-proxy] Running on http://localhost:${PORT_PROXY}`);
  console.log(`[dev-proxy] API -> ${API_TARGET}`);
  console.log(`[dev-proxy] UI  -> ${UI_TARGET}`);
});
