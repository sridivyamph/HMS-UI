const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = createProxyMiddleware({
  // target: 'https://gateway.zautomate.in',
  target: 'https://zcare.zautomate.in',
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq, req) => {
    if (req.url.startsWith('/config/api/v1/razorpay')) {
      proxyReq.removeHeader('origin');
    }
  },
});

module.exports = function (app) {
  app.use((req, res, next) => {
    if (req.url.startsWith('/config')) {
      return proxy(req, res, next);
    }
    next();
  });
};
