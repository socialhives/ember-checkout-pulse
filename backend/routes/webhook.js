const express = require('express');
const crypto = require('crypto');
const logger = require('../utils/logger');

const router = express.Router();

// Webhook signature verification middleware
const verifyWebhookSignature = (req, res, next) => {
  try {
    const signature = req.headers['x-cybersource-signature'];
    const webhookSecret = process.env.WEBHOOK_SECRET;
    
    if (!signature || !webhookSecret) {
      logger.warn('Webhook signature verification failed: missing signature or secret');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid webhook signature'
      });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');

    const providedSignature = signature.replace('sha256=', '');

    if (!crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    )) {
      logger.warn('Webhook signature verification failed: signature mismatch');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid webhook signature'
      });
    }

    next();
  } catch (error) {
    logger.error('Webhook signature verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook signature verification failed'
    });
  }
};

// CyberSource webhook endpoint
router.post('/cybersource', verifyWebhookSignature, (req, res) => {
  try {
    const webhookData = JSON.parse(req.body.toString());
    
    logger.info('Received CyberSource webhook', {
      eventType: webhookData.eventType,
      transactionId: webhookData.payload?.id,
      status: webhookData.payload?.status
    });

    // Process different webhook events
    switch (webhookData.eventType) {
      case 'payment.authorized':
        handlePaymentAuthorized(webhookData.payload);
        break;
      case 'payment.captured':
        handlePaymentCaptured(webhookData.payload);
        break;
      case 'payment.declined':
        handlePaymentDeclined(webhookData.payload);
        break;
      case 'payment.refunded':
        handlePaymentRefunded(webhookData.payload);
        break;
      case 'payment.voided':
        handlePaymentVoided(webhookData.payload);
        break;
      case 'payment.failed':
        handlePaymentFailed(webhookData.payload);
        break;
      default:
        logger.info('Unhandled webhook event type:', webhookData.eventType);
    }

    // Acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Webhook received and processed'
    });

  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

// Webhook event handlers
function handlePaymentAuthorized(payload) {
  logger.info('Payment authorized', {
    transactionId: payload.id,
    amount: payload.orderInformation?.amountInformation?.totalAmount,
    currency: payload.orderInformation?.amountInformation?.currency
  });

  // TODO: Update your database with payment authorization
  // TODO: Send confirmation email to customer
  // TODO: Update order status
}

function handlePaymentCaptured(payload) {
  logger.info('Payment captured', {
    transactionId: payload.id,
    amount: payload.orderInformation?.amountInformation?.totalAmount,
    currency: payload.orderInformation?.amountInformation?.currency
  });

  // TODO: Update your database with payment capture
  // TODO: Fulfill the order
  // TODO: Send receipt to customer
}

function handlePaymentDeclined(payload) {
  logger.info('Payment declined', {
    transactionId: payload.id,
    reason: payload.errorInformation?.reason
  });

  // TODO: Update your database with payment decline
  // TODO: Notify customer of declined payment
  // TODO: Suggest alternative payment methods
}

function handlePaymentRefunded(payload) {
  logger.info('Payment refunded', {
    transactionId: payload.id,
    amount: payload.orderInformation?.amountInformation?.totalAmount,
    currency: payload.orderInformation?.amountInformation?.currency
  });

  // TODO: Update your database with refund information
  // TODO: Update order status
  // TODO: Send refund confirmation to customer
}

function handlePaymentVoided(payload) {
  logger.info('Payment voided', {
    transactionId: payload.id
  });

  // TODO: Update your database with void information
  // TODO: Update order status
  // TODO: Send void confirmation to customer
}

function handlePaymentFailed(payload) {
  logger.error('Payment failed', {
    transactionId: payload.id,
    error: payload.errorInformation
  });

  // TODO: Update your database with payment failure
  // TODO: Notify customer of payment failure
  // TODO: Log for investigation
}

// Test webhook endpoint (for development)
if (process.env.NODE_ENV === 'development') {
  router.post('/test', (req, res) => {
    logger.info('Test webhook received:', req.body);
    
    res.json({
      success: true,
      message: 'Test webhook received',
      data: req.body
    });
  });
}

module.exports = router;