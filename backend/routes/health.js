const express = require('express');
const cyberSourceConfig = require('../config/cybersource');

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CyberSource Payment API is healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Detailed health check with dependencies
router.get('/detailed', async (req, res) => {
  const healthCheck = {
    success: true,
    message: 'Health check completed',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: 'healthy',
      cybersource: 'unknown'
    }
  };

  try {
    // Test CyberSource configuration
    const config = cyberSourceConfig;
    if (config.merchantId && config.apiKey && config.secretKey) {
      healthCheck.services.cybersource = 'configured';
    } else {
      healthCheck.services.cybersource = 'misconfigured';
      healthCheck.success = false;
    }
  } catch (error) {
    healthCheck.services.cybersource = 'error';
    healthCheck.success = false;
  }

  const statusCode = healthCheck.success ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// Readiness probe
router.get('/ready', (req, res) => {
  // Check if all required environment variables are set
  const requiredEnvVars = [
    'CYBERSOURCE_MERCHANT_ID',
    'CYBERSOURCE_API_KEY',
    'CYBERSOURCE_SECRET_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    return res.status(503).json({
      success: false,
      message: 'Service not ready',
      missingConfiguration: missingVars
    });
  }

  res.json({
    success: true,
    message: 'Service is ready',
    timestamp: new Date().toISOString()
  });
});

// Liveness probe
router.get('/live', (req, res) => {
  res.json({
    success: true,
    message: 'Service is alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;