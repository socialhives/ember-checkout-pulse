const cybersourceRestApi = require('cybersource-rest-client');

class CyberSourceConfig {
  constructor() {
    this.merchantId = process.env.CYBERSOURCE_MERCHANT_ID;
    this.apiKey = process.env.CYBERSOURCE_API_KEY;
    this.secretKey = process.env.CYBERSOURCE_SECRET_KEY;
    this.runEnvironment = process.env.CYBERSOURCE_RUN_ENVIRONMENT || 'apitest.cybersource.com';
    this.timeout = parseInt(process.env.CYBERSOURCE_TIMEOUT) || 1000;
    
    this.validateConfig();
  }

  validateConfig() {
    const requiredFields = ['merchantId', 'apiKey', 'secretKey'];
    const missingFields = requiredFields.filter(field => !this[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required CyberSource configuration: ${missingFields.join(', ')}`);
    }
  }

  getApiClient() {
    const configObject = {
      authenticationType: 'HTTP_SIGNATURE',
      merchantID: this.merchantId,
      merchantKeyId: this.apiKey,
      merchantsecretKey: this.secretKey,
      runEnvironment: this.runEnvironment,
      timeout: this.timeout,
      logConfiguration: {
        enableLog: process.env.NODE_ENV === 'development',
        logFileName: 'cybs',
        logDirectory: './logs',
        logFileMaxSize: '5242880', // 5MB
        loggingLevel: 'debug'
      }
    };

    const apiClient = new cybersourceRestApi.ApiClient();
    return apiClient;
  }

  getPaymentsApi() {
    return new cybersourceRestApi.PaymentsApi(this.getApiClient());
  }

  getCaptureApi() {
    return new cybersourceRestApi.CaptureApi(this.getApiClient());
  }

  getRefundApi() {
    return new cybersourceRestApi.RefundApi(this.getApiClient());
  }

  getVoidApi() {
    return new cybersourceRestApi.VoidApi(this.getApiClient());
  }

  getTransactionDetailsApi() {
    return new cybersourceRestApi.TransactionDetailsApi(this.getApiClient());
  }
}

module.exports = new CyberSourceConfig();