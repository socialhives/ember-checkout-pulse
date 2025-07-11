const cybersourceRestApi = require('cybersource-rest-client');
const { v4: uuidv4 } = require('uuid');
const cyberSourceConfig = require('../config/cybersource');
const logger = require('../utils/logger');

class PaymentService {
  constructor() {
    this.paymentsApi = cyberSourceConfig.getPaymentsApi();
    this.captureApi = cyberSourceConfig.getCaptureApi();
    this.refundApi = cyberSourceConfig.getRefundApi();
    this.voidApi = cyberSourceConfig.getVoidApi();
    this.transactionDetailsApi = cyberSourceConfig.getTransactionDetailsApi();
  }

  async processPayment(paymentData) {
    try {
      const clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
      clientReferenceInformation.code = paymentData.referenceCode || uuidv4();

      const processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
      processingInformation.capture = paymentData.capture || false;

      const paymentInformation = this.buildPaymentInformation(paymentData);
      const orderInformation = this.buildOrderInformation(paymentData);
      const buyerInformation = this.buildBuyerInformation(paymentData);

      const requestObj = new cybersourceRestApi.CreatePaymentRequest();
      requestObj.clientReferenceInformation = clientReferenceInformation;
      requestObj.processingInformation = processingInformation;
      requestObj.paymentInformation = paymentInformation;
      requestObj.orderInformation = orderInformation;
      requestObj.buyerInformation = buyerInformation;

      logger.info(`Processing payment for reference: ${clientReferenceInformation.code}`);

      const response = await this.paymentsApi.createPayment(requestObj);
      
      return this.formatPaymentResponse(response);
    } catch (error) {
      logger.error('Payment processing error:', error);
      throw this.handleCyberSourceError(error);
    }
  }

  async capturePayment(paymentId, captureData) {
    try {
      const clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsidcapturesClientReferenceInformation();
      clientReferenceInformation.code = captureData.referenceCode || uuidv4();

      const orderInformation = new cybersourceRestApi.Ptsv2paymentsidcapturesOrderInformation();
      const amountInformation = new cybersourceRestApi.Ptsv2paymentsidcapturesOrderInformationAmountInformation();
      amountInformation.totalAmount = captureData.amount.toString();
      amountInformation.currency = captureData.currency || 'INR';
      orderInformation.amountInformation = amountInformation;

      const requestObj = new cybersourceRestApi.CapturePaymentRequest();
      requestObj.clientReferenceInformation = clientReferenceInformation;
      requestObj.orderInformation = orderInformation;

      logger.info(`Capturing payment: ${paymentId}`);

      const response = await this.captureApi.capturePayment(requestObj, paymentId);
      
      return this.formatCaptureResponse(response);
    } catch (error) {
      logger.error('Payment capture error:', error);
      throw this.handleCyberSourceError(error);
    }
  }

  async refundPayment(paymentId, refundData) {
    try {
      const clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsidrefundsClientReferenceInformation();
      clientReferenceInformation.code = refundData.referenceCode || uuidv4();

      const orderInformation = new cybersourceRestApi.Ptsv2paymentsidrefundsOrderInformation();
      const amountInformation = new cybersourceRestApi.Ptsv2paymentsidrefundsOrderInformationAmountInformation();
      amountInformation.totalAmount = refundData.amount.toString();
      amountInformation.currency = refundData.currency || 'INR';
      orderInformation.amountInformation = amountInformation;

      const requestObj = new cybersourceRestApi.RefundPaymentRequest();
      requestObj.clientReferenceInformation = clientReferenceInformation;
      requestObj.orderInformation = orderInformation;

      logger.info(`Refunding payment: ${paymentId}`);

      const response = await this.refundApi.refundPayment(requestObj, paymentId);
      
      return this.formatRefundResponse(response);
    } catch (error) {
      logger.error('Payment refund error:', error);
      throw this.handleCyberSourceError(error);
    }
  }

  async voidPayment(paymentId, voidData) {
    try {
      const clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsidreversalsClientReferenceInformation();
      clientReferenceInformation.code = voidData.referenceCode || uuidv4();

      const requestObj = new cybersourceRestApi.VoidPaymentRequest();
      requestObj.clientReferenceInformation = clientReferenceInformation;

      logger.info(`Voiding payment: ${paymentId}`);

      const response = await this.voidApi.voidPayment(requestObj, paymentId);
      
      return this.formatVoidResponse(response);
    } catch (error) {
      logger.error('Payment void error:', error);
      throw this.handleCyberSourceError(error);
    }
  }

  async getTransactionDetails(transactionId) {
    try {
      logger.info(`Fetching transaction details: ${transactionId}`);

      const response = await this.transactionDetailsApi.getTransaction(transactionId);
      
      return this.formatTransactionResponse(response);
    } catch (error) {
      logger.error('Transaction details error:', error);
      throw this.handleCyberSourceError(error);
    }
  }

  buildPaymentInformation(paymentData) {
    const paymentInformation = new cybersourceRestApi.Ptsv2paymentsPaymentInformation();
    
    if (paymentData.card) {
      const card = new cybersourceRestApi.Ptsv2paymentsPaymentInformationCard();
      card.number = paymentData.card.number;
      card.expirationMonth = paymentData.card.expirationMonth;
      card.expirationYear = paymentData.card.expirationYear;
      card.securityCode = paymentData.card.securityCode;
      paymentInformation.card = card;
    }

    return paymentInformation;
  }

  buildOrderInformation(paymentData) {
    const orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
    
    const amountInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountInformation();
    amountInformation.totalAmount = paymentData.amount.toString();
    amountInformation.currency = paymentData.currency || 'INR';
    orderInformation.amountInformation = amountInformation;

    if (paymentData.billTo) {
      const billTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
      billTo.firstName = paymentData.billTo.firstName;
      billTo.lastName = paymentData.billTo.lastName;
      billTo.address1 = paymentData.billTo.address1;
      billTo.locality = paymentData.billTo.city;
      billTo.administrativeArea = paymentData.billTo.state;
      billTo.postalCode = paymentData.billTo.postalCode;
      billTo.country = paymentData.billTo.country;
      billTo.email = paymentData.billTo.email;
      billTo.phoneNumber = paymentData.billTo.phoneNumber;
      orderInformation.billTo = billTo;
    }

    return orderInformation;
  }

  buildBuyerInformation(paymentData) {
    if (!paymentData.buyer) return null;

    const buyerInformation = new cybersourceRestApi.Ptsv2paymentsBuyerInformation();
    buyerInformation.merchantCustomerId = paymentData.buyer.customerId;
    
    return buyerInformation;
  }

  formatPaymentResponse(response) {
    const data = response['responseBody'] || response;
    
    return {
      id: data.id,
      status: data.status,
      submitTimeUtc: data.submitTimeUtc,
      clientReferenceInformation: data.clientReferenceInformation,
      processorInformation: data.processorInformation,
      paymentInformation: data.paymentInformation,
      orderInformation: data.orderInformation,
      errorInformation: data.errorInformation
    };
  }

  formatCaptureResponse(response) {
    const data = response['responseBody'] || response;
    
    return {
      id: data.id,
      status: data.status,
      submitTimeUtc: data.submitTimeUtc,
      clientReferenceInformation: data.clientReferenceInformation,
      orderInformation: data.orderInformation
    };
  }

  formatRefundResponse(response) {
    const data = response['responseBody'] || response;
    
    return {
      id: data.id,
      status: data.status,
      submitTimeUtc: data.submitTimeUtc,
      clientReferenceInformation: data.clientReferenceInformation,
      orderInformation: data.orderInformation
    };
  }

  formatVoidResponse(response) {
    const data = response['responseBody'] || response;
    
    return {
      id: data.id,
      status: data.status,
      submitTimeUtc: data.submitTimeUtc,
      clientReferenceInformation: data.clientReferenceInformation
    };
  }

  formatTransactionResponse(response) {
    const data = response['responseBody'] || response;
    
    return {
      id: data.id,
      status: data.status,
      submitTimeUtc: data.submitTimeUtc,
      applicationInformation: data.applicationInformation,
      clientReferenceInformation: data.clientReferenceInformation,
      orderInformation: data.orderInformation,
      paymentInformation: data.paymentInformation,
      processorInformation: data.processorInformation
    };
  }

  handleCyberSourceError(error) {
    if (error.response && error.response.body) {
      const errorBody = error.response.body;
      return new Error(`CyberSource Error: ${errorBody.message || 'Payment processing failed'}`);
    }
    
    if (error.message) {
      return new Error(`Payment Error: ${error.message}`);
    }
    
    return new Error('Unknown payment processing error');
  }
}

module.exports = new PaymentService();