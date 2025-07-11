const express = require('express');
const { body, validationResult } = require('express-validator');
const paymentService = require('../services/paymentService');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validatePayment = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR'])
    .withMessage('Currency must be INR, USD, or EUR'),
  body('card.number')
    .isLength({ min: 13, max: 19 })
    .isNumeric()
    .withMessage('Card number must be 13-19 digits'),
  body('card.expirationMonth')
    .isInt({ min: 1, max: 12 })
    .withMessage('Expiration month must be 1-12'),
  body('card.expirationYear')
    .isInt({ min: new Date().getFullYear() })
    .withMessage('Expiration year must be current year or later'),
  body('card.securityCode')
    .isLength({ min: 3, max: 4 })
    .isNumeric()
    .withMessage('Security code must be 3-4 digits'),
  body('billTo.firstName')
    .notEmpty()
    .withMessage('First name is required'),
  body('billTo.lastName')
    .notEmpty()
    .withMessage('Last name is required'),
  body('billTo.email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('billTo.phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
];

const validateCapture = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR'])
    .withMessage('Currency must be INR, USD, or EUR')
];

const validateRefund = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR'])
    .withMessage('Currency must be INR, USD, or EUR'),
  body('reason')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Reason must be less than 255 characters')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Process payment
router.post('/process', validatePayment, handleValidationErrors, async (req, res) => {
  try {
    logger.info('Processing payment request', { 
      amount: req.body.amount, 
      currency: req.body.currency,
      customerEmail: req.body.billTo?.email 
    });

    const paymentData = {
      amount: req.body.amount,
      currency: req.body.currency || 'INR',
      capture: req.body.capture || false,
      referenceCode: req.body.referenceCode,
      card: {
        number: req.body.card.number,
        expirationMonth: req.body.card.expirationMonth.toString().padStart(2, '0'),
        expirationYear: req.body.card.expirationYear.toString(),
        securityCode: req.body.card.securityCode
      },
      billTo: {
        firstName: req.body.billTo.firstName,
        lastName: req.body.billTo.lastName,
        address1: req.body.billTo.address1 || '',
        city: req.body.billTo.city || '',
        state: req.body.billTo.state || '',
        postalCode: req.body.billTo.postalCode || '',
        country: req.body.billTo.country || 'IN',
        email: req.body.billTo.email,
        phoneNumber: req.body.billTo.phoneNumber
      },
      buyer: req.body.buyer
    };

    const result = await paymentService.processPayment(paymentData);

    logger.info('Payment processed successfully', { 
      paymentId: result.id, 
      status: result.status 
    });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: result
    });

  } catch (error) {
    logger.error('Payment processing failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment processing failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Capture payment
router.post('/:paymentId/capture', validateCapture, handleValidationErrors, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    logger.info('Capturing payment', { paymentId, amount: req.body.amount });

    const captureData = {
      amount: req.body.amount,
      currency: req.body.currency || 'INR',
      referenceCode: req.body.referenceCode
    };

    const result = await paymentService.capturePayment(paymentId, captureData);

    logger.info('Payment captured successfully', { 
      paymentId, 
      captureId: result.id 
    });

    res.json({
      success: true,
      message: 'Payment captured successfully',
      data: result
    });

  } catch (error) {
    logger.error('Payment capture failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment capture failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Refund payment
router.post('/:paymentId/refund', validateRefund, handleValidationErrors, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    logger.info('Refunding payment', { paymentId, amount: req.body.amount });

    const refundData = {
      amount: req.body.amount,
      currency: req.body.currency || 'INR',
      referenceCode: req.body.referenceCode,
      reason: req.body.reason
    };

    const result = await paymentService.refundPayment(paymentId, refundData);

    logger.info('Payment refunded successfully', { 
      paymentId, 
      refundId: result.id 
    });

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: result
    });

  } catch (error) {
    logger.error('Payment refund failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment refund failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Void payment
router.post('/:paymentId/void', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    logger.info('Voiding payment', { paymentId });

    const voidData = {
      referenceCode: req.body.referenceCode
    };

    const result = await paymentService.voidPayment(paymentId, voidData);

    logger.info('Payment voided successfully', { 
      paymentId, 
      voidId: result.id 
    });

    res.json({
      success: true,
      message: 'Payment voided successfully',
      data: result
    });

  } catch (error) {
    logger.error('Payment void failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment void failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get transaction details
router.get('/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    logger.info('Fetching transaction details', { transactionId });

    const result = await paymentService.getTransactionDetails(transactionId);

    res.json({
      success: true,
      message: 'Transaction details retrieved successfully',
      data: result
    });

  } catch (error) {
    logger.error('Failed to fetch transaction details:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transaction details',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;