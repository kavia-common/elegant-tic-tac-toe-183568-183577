/* eslint-disable @typescript-eslint/no-require-imports */
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Preserve any existing devServer configuration
  const existingDevServer = config.devServer || {};
  const existingHeaders = existingDevServer.headers || {};
  const healthPath = process.env.EXPO_PUBLIC_HEALTHCHECK_PATH || '/health';
  const originalSetupMiddlewares = existingDevServer.setupMiddlewares;

  // Add dev server headers and lightweight healthcheck route
  config.devServer = {
    ...existingDevServer,
    headers: {
      ...existingHeaders,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods':
        'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': '*',
      'X-Frame-Options': 'ALLOWALL',
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (devServer && devServer.app) {
        const app = devServer.app;

        // Fast HEAD healthcheck
        app.head(healthPath, (_req, res) => {
          res.status(200).end();
        });

        // Simple GET healthcheck
        app.get(healthPath, (_req, res) => {
          res.status(200).send('OK');
        });
      }

      // Call through to any existing setupMiddlewares defined by Expo/webpack
      if (typeof originalSetupMiddlewares === 'function') {
        return originalSetupMiddlewares(middlewares, devServer);
      }

      return middlewares;
    },
  };

  return config;
};
