import { createPayment, processPayment, getPayment } from '../services/paymentService.js';
import { getOrder } from '../services/orderService.js';
import { validateVPA, luhnCheck, detectCardNetwork, validateExpiry } from '../services/validationService.js';

// ---------------- Authenticated create/get (unchanged) ----------------

export const createPaymentHandler = async (req, res) => {
  try {
    const { order_id, method, vpa, card } = req.body;

    const order = await getOrder(order_id, req.merchantId);
    if (!order) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND_ERROR',
          description: 'Order not found',
        },
      });
    }

    let paymentData = {
      order_id,
      method,
      amount: order.amount,
      currency: order.currency,
    };

    if (method === 'upi') {
      if (!vpa || !validateVPA(vpa)) {
        return res.status(400).json({
          error: {
            code: 'INVALID_VPA',
            description: 'Invalid VPA format',
          },
        });
      }
      paymentData.vpa = vpa;
    } else if (method === 'card') {
      if (
        !card ||
        !card.number ||
        !card.expiry_month ||
        !card.expiry_year ||
        !card.cvv ||
        !card.holder_name
      ) {
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST_ERROR',
            description: 'Missing required card fields',
          },
        });
      }

      if (!luhnCheck(card.number)) {
        return res.status(400).json({
          error: {
            code: 'INVALID_CARD',
            description: 'Invalid card number',
          },
        });
      }

      if (!validateExpiry(card.expiry_month, card.expiry_year)) {
        return res.status(400).json({
          error: {
            code: 'EXPIRED_CARD',
            description: 'Card has expired',
          },
        });
      }

      const cardNetwork = detectCardNetwork(card.number);
      const cleanedNumber = card.number.replace(/[\s-]/g, '');
      const last4 = cleanedNumber.slice(-4);

      paymentData.card_network = cardNetwork;
      paymentData.card_last4 = last4;
    } else {
      return res.status(400).json({
        error: {
          code: 'BAD_REQUEST_ERROR',
          description: 'Invalid payment method',
        },
      });
    }

    const payment = await createPayment(req.merchantId, paymentData);
    const processedPayment = await processPayment(payment.id, method);

    const response = {
      id: processedPayment.id,
      order_id: processedPayment.order_id,
      amount: processedPayment.amount,
      currency: processedPayment.currency,
      method: processedPayment.method,
      status: processedPayment.status,
      created_at: processedPayment.created_at,
    };

    if (method === 'upi') {
      response.vpa = processedPayment.vpa;
    } else if (method === 'card') {
      response.card_network = processedPayment.card_network;
      response.card_last4 = processedPayment.card_last4;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        description: 'Internal server error',
      },
    });
  }
};

export const getPaymentHandler = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const payment = await getPayment(payment_id, req.merchantId);

    if (!payment) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND_ERROR',
          description: 'Payment not found',
        },
      });
    }

    const response = {
      id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
    };

    if (payment.method === 'upi') {
      response.vpa = payment.vpa;
    } else if (payment.method === 'card') {
      response.card_network = payment.card_network;
      response.card_last4 = payment.card_last4;
    }

    if (payment.error_code) {
      response.error_code = payment.error_code;
      response.error_description = payment.error_description;
    }

    res.json(response);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        description: 'Internal server error',
      },
    });
  }
};

// ---------------- Public create/get (used by Checkout.jsx) ----------------

export const createPaymentPublicHandler = async (req, res) => {
  try {
    const { order_id, method, vpa, card, amount } = req.body;

    const { query } = await import('../config/database.js');
    const orderResult = await query(`SELECT * FROM orders WHERE id = $1`, [
      order_id,
    ]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND_ERROR',
          description: 'Order not found',
        },
      });
    }

    const order = orderResult.rows[0];

    const parsedAmount = Number(amount);
    const finalAmount =
      Number.isFinite(parsedAmount) && parsedAmount > 0
        ? parsedAmount
        : order.amount;

    let paymentData = {
      order_id,
      method,
      amount: finalAmount,
      currency: order.currency,
    };

    if (method === 'upi') {
      if (!vpa || !validateVPA(vpa)) {
        return res.status(400).json({
          error: {
            code: 'INVALID_VPA',
            description: 'Invalid VPA format',
          },
        });
      }
      paymentData.vpa = vpa;
    } else if (method === 'card') {
      if (
        !card ||
        !card.number ||
        !card.expiry_month ||
        !card.expiry_year ||
        !card.cvv ||
        !card.holder_name
      ) {
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST_ERROR',
            description: 'Missing required card fields',
          },
        });
      }

      if (!luhnCheck(card.number)) {
        return res.status(400).json({
          error: {
            code: 'INVALID_CARD',
            description: 'Invalid card number',
          },
        });
      }

      if (!validateExpiry(card.expiry_month, card.expiry_year)) {
        return res.status(400).json({
          error: {
            code: 'EXPIRED_CARD',
            description: 'Card has expired',
          },
        });
      }

      const cardNetwork = detectCardNetwork(card.number);
      const cleanedNumber = card.number.replace(/[\s-]/g, '');
      const last4 = cleanedNumber.slice(-4);

      paymentData.card_network = cardNetwork;
      paymentData.card_last4 = last4;
    } else {
      return res.status(400).json({
        error: {
          code: 'BAD_REQUEST_ERROR',
          description: 'Invalid payment method',
        },
      });
    }

    const payment = await createPayment(order.merchant_id, paymentData);
    const processedPayment = await processPayment(payment.id, method);

    const response = {
      id: processedPayment.id,
      order_id: processedPayment.order_id,
      amount: processedPayment.amount,
      currency: processedPayment.currency,
      method: processedPayment.method,
      status: processedPayment.status,
      created_at: processedPayment.created_at,
    };

    if (method === 'upi') {
      response.vpa = processedPayment.vpa;
    } else if (method === 'card') {
      response.card_network = processedPayment.card_network;
      response.card_last4 = processedPayment.card_last4;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Create payment public error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        description: 'Internal server error',
      },
    });
  }
};

export const getPaymentPublicHandler = async (req, res) => {
  try {
    const { payment_id } = req.params;

    const { query } = await import('../config/database.js');
    const result = await query(`SELECT * FROM payments WHERE id = $1`, [
      payment_id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND_ERROR',
          description: 'Payment not found',
        },
      });
    }

    const payment = result.rows[0];

    const response = {
      id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
    };

    if (payment.method === 'upi') {
      response.vpa = payment.vpa;
    } else if (payment.method === 'card') {
      response.card_network = payment.card_network;
      response.card_last4 = payment.card_last4;
    }

    res.json(response);
  } catch (error) {
    console.error('Get payment public error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        description: 'Internal server error',
      },
    });
  }
};
