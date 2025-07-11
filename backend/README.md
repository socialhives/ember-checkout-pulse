# CyberSource Payment Gateway Backend

A robust Node.js backend service for integrating with CyberSource payment gateway via Visanet. This service provides secure payment processing, webhook handling, and comprehensive API endpoints for payment operations.

## Features

- **Payment Processing**: Authorize, capture, refund, and void payments
- **Webhook Support**: Handle CyberSource webhook events
- **Security**: Rate limiting, input validation, and secure error handling
- **Monitoring**: Health checks and comprehensive logging
- **Validation**: Request validation with detailed error messages
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Prerequisites

- Node.js 16+ 
- CyberSource merchant account
- Valid CyberSource API credentials

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CyberSource Configuration
CYBERSOURCE_MERCHANT_ID=your_merchant_id
CYBERSOURCE_API_KEY=your_api_key
CYBERSOURCE_SECRET_KEY=your_secret_key
CYBERSOURCE_RUN_ENVIRONMENT=apitest.cybersource.com
CYBERSOURCE_TIMEOUT=1000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret

# Logging
LOG_LEVEL=info
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Testing
```bash
npm test
```

## API Endpoints

### Health Checks
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health check with dependencies
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

### Payment Operations

#### Process Payment
```http
POST /api/payment/process
Content-Type: application/json

{
  "amount": 100.00,
  "currency": "INR",
  "capture": false,
  "referenceCode": "ORDER-123",
  "card": {
    "number": "4111111111111111",
    "expirationMonth": 12,
    "expirationYear": 2025,
    "securityCode": "123"
  },
  "billTo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+91-9876543210",
    "address1": "123 Main St",
    "city": "Mumbai",
    "state": "MH",
    "postalCode": "400001",
    "country": "IN"
  }
}
```

#### Capture Payment
```http
POST /api/payment/{paymentId}/capture
Content-Type: application/json

{
  "amount": 100.00,
  "currency": "INR",
  "referenceCode": "CAPTURE-123"
}
```

#### Refund Payment
```http
POST /api/payment/{paymentId}/refund
Content-Type: application/json

{
  "amount": 50.00,
  "currency": "INR",
  "referenceCode": "REFUND-123",
  "reason": "Customer request"
}
```

#### Void Payment
```http
POST /api/payment/{paymentId}/void
Content-Type: application/json

{
  "referenceCode": "VOID-123"
}
```

#### Get Transaction Details
```http
GET /api/payment/{transactionId}
```

### Webhooks

#### CyberSource Webhook
```http
POST /api/webhook/cybersource
Content-Type: application/json
X-CyberSource-Signature: sha256=signature_here

{
  "eventType": "payment.authorized",
  "payload": {
    "id": "transaction_id",
    "status": "AUTHORIZED",
    ...
  }
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes globally, 10 payment requests per 15 minutes
- **Input Validation**: Comprehensive validation using express-validator
- **Helmet**: Security headers for protection against common vulnerabilities
- **CORS**: Configurable cross-origin resource sharing
- **Webhook Verification**: HMAC signature verification for webhooks

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

## Logging

Logs are written to both console and files (in production):
- `logs/error.log` - Error level logs
- `logs/warn.log` - Warning level logs
- `logs/info.log` - Info level logs
- `logs/debug.log` - Debug level logs

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3001 |
| `NODE_ENV` | Environment | No | development |
| `CYBERSOURCE_MERCHANT_ID` | CyberSource merchant ID | Yes | - |
| `CYBERSOURCE_API_KEY` | CyberSource API key | Yes | - |
| `CYBERSOURCE_SECRET_KEY` | CyberSource secret key | Yes | - |
| `CYBERSOURCE_RUN_ENVIRONMENT` | CyberSource environment | No | apitest.cybersource.com |
| `CYBERSOURCE_TIMEOUT` | Request timeout (ms) | No | 1000 |
| `JWT_SECRET` | JWT secret key | No | - |
| `JWT_EXPIRES_IN` | JWT expiration | No | 24h |
| `ALLOWED_ORIGINS` | CORS allowed origins | No | http://localhost:5173 |
| `WEBHOOK_SECRET` | Webhook verification secret | No | - |
| `LOG_LEVEL` | Logging level | No | info |

## Webhook Events

The service handles the following CyberSource webhook events:
- `payment.authorized` - Payment authorization successful
- `payment.captured` - Payment capture successful
- `payment.declined` - Payment declined
- `payment.refunded` - Payment refunded
- `payment.voided` - Payment voided
- `payment.failed` - Payment failed

## Testing

Use the provided test endpoints and sample data to verify integration:

### Test Card Numbers
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **American Express**: 378282246310005

### Test Environment
Set `CYBERSOURCE_RUN_ENVIRONMENT=apitest.cybersource.com` for testing.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use production CyberSource credentials
3. Set `CYBERSOURCE_RUN_ENVIRONMENT=api.cybersource.com`
4. Configure proper logging and monitoring
5. Set up SSL/TLS termination
6. Configure firewall and security groups

## Support

For CyberSource-specific issues, refer to:
- [CyberSource Developer Documentation](https://developer.cybersource.com/)
- [CyberSource REST API Reference](https://developer.cybersource.com/api-reference-assets/index.html)

## License

MIT License - see LICENSE file for details.