import express from 'express';
import { healthCheck } from '../controllers/healthController.js';
import { createOrderHandler, getOrderHandler, getOrderPublicHandler } from '../controllers/orderController.js';
import { createPaymentHandler, getPaymentHandler, createPaymentPublicHandler, getPaymentPublicHandler } from '../controllers/paymentController.js';
import { getTestMerchant } from '../controllers/testController.js';
import { getPaymentsList, getStats } from '../controllers/dashboardController.js';
import { query } from '../config/database.js';

const router = express.Router();

// Auth middleware
const authenticate = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const apiSecret = req.headers['x-api-secret'];

    if (!apiKey || !apiSecret) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_ERROR',
          description: 'Invalid API credentials'
        }
      });
    }

    const result = await query(
      `SELECT id FROM merchants WHERE api_key = $1 AND api_secret = $2 AND is_active = true`,
      [apiKey, apiSecret]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_ERROR',
          description: 'Invalid API credentials'
        }
      });
    }

    req.merchantId = result.rows[0].id;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        description: 'Internal server error'
      }
    });
  }
};

// Public routes
router.get('/health', healthCheck);
router.get('/api/v1/test/merchant', getTestMerchant);
router.get('/api/v1/orders/:order_id/public', getOrderPublicHandler);
router.post('/api/v1/payments/public', createPaymentPublicHandler);
router.get('/api/v1/payments/:payment_id/public', getPaymentPublicHandler);

// Protected routes
// Protected routes
router.post('/api/v1/orders', authenticate, createOrderHandler);
router.get('/api/v1/orders/:order_id', authenticate, getOrderHandler);

// Put the *specific* payment routes first
router.get('/api/v1/payments/list', authenticate, getPaymentsList);
router.get('/api/v1/payments/stats', authenticate, getStats);

// Then the generic payment-by-id route
router.post('/api/v1/payments', authenticate, createPaymentHandler);
router.get('/api/v1/payments/:payment_id', authenticate, getPaymentHandler);


export default router;
