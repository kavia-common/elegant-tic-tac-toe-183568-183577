const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      // Iframe embedding headers
      res.setHeader('X-Frame-Options', 'ALLOWALL');
      res.setHeader('Content-Security-Policy', "frame-ancestors *");
      
      // Handle preflight
      if (req.method === 'OPTIONS' || req.method === 'HEAD') {
        res.statusCode = 200;
        res.end();
        return;
      }
      
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
