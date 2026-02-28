
# Payment Gateway — Full‑Stack Demo (Razorpay/Stripe‑Inspired)

A production‑style payment gateway application that simulates real‑world payment workflows including UPI and Card payments, merchant management, hosted checkout, secure API authentication, and one‑command Docker deployment.

Designed for learning, evaluation, and portfolio demonstration of backend APIs, payment validation logic, frontend dashboards, and containerized DevOps practices.

---

## Key Features

- Multi‑method payments: UPI & Cards
- Merchant dashboard with transactions & analytics
- Hosted, responsive checkout page
- Secure API Key + Secret authentication
- Payment validations:
  - UPI VPA format validation
  - Luhn algorithm for card numbers
  - Card network detection
- Fully Dockerized deployment (one command)
- PostgreSQL with relational schema & constraints
- Pre‑seeded test merchant for instant evaluation

---

## Tech Stack

**Backend**
- Node.js, Express.js
- PostgreSQL 15
- node‑postgres (pg)

**Frontend**
- React 18 + Vite
- React Router v6
- Axios
- Custom CSS

**DevOps**
- Docker & Docker Compose
- Nginx

---

## Prerequisites

- Docker ≥ 20.10
- Docker Compose ≥ 2.0
- Git

---

## Quick Start

Clone and launch all services:

```bash
git clone https://github.com/sailajabevara/payment-gateway
cd payment-gateway
docker-compose up -d
```

---

## Application URLs

| Service | URL |
|----------|------|
Merchant Dashboard | http://localhost:3000 |
Checkout Page | http://localhost:3001 |
Backend API | http://localhost:8000 |
Health Check | http://localhost:8000/health |

---

## Test Credentials

### Merchant Login
Email: test@example.com  
Password: Any password

### API Access
API Key: `key_test_abc123`  
API Secret: `secret_test_xyz789`

---

## Test Payment Data

### Card Payments

| Network | Number |
|----------|---------|
Visa | 4111 1111 1111 1111 |
Mastercard | 5555 5555 5555 4444 |

Expiry: Any future date (e.g., 12/25)  
CVV: Any 3 digits

### UPI Payments

Format: `username@bank`  
Examples: `test@paytm`, `user@upi`

---

## Payment Flow

1. Merchant creates an order (Dashboard or API)
2. Customer is redirected to hosted checkout
3. Customer selects UPI or Card
4. Payment enters `processing` state
5. Simulated bank delay (5–10 seconds)
6. Status updates to `success` or `failed`

Success Rates:
- UPI → 90%
- Card → 95%

---

## API Overview

Base URL: `http://localhost:8000`

### Public Endpoints

- GET `/health`
- GET `/api/v1/test/merchant`
- GET `/api/v1/orders/{order_id}/public`
- POST `/api/v1/payments/public`
- GET `/api/v1/payments/{payment_id}/public`

### Protected Endpoints (API Key + Secret)

- POST `/api/v1/orders`
- GET `/api/v1/orders/{order_id}`
- POST `/api/v1/payments`
- GET `/api/v1/payments/{payment_id}`
- GET `/api/v1/payments/list`
- GET `/api/v1/payments/stats`

---

## Project Structure

```
payment-gateway/
├── docker-compose.yml
├── .env.example
├── backend/
├── frontend/ (Merchant Dashboard)
└── checkout-page/
```

---

## Database Schema

Three core tables:

- **Merchants** — Profiles & API credentials
- **Orders** — Merchant‑created payment orders
- **Payments** — Transaction records & statuses

Foreign key relationships enforce data integrity.

---

## Security Highlights

- API key & secret authentication
- No storage of CVV or full card numbers
- Card masking (last 4 digits only)
- Input validation for UPI & cards
- Environment‑based configuration
- Test mode for safe evaluation

---

## Maintenance Commands

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild All
```bash
docker-compose down
docker-compose up -d --build
```

### View Logs
```bash
docker-compose logs -f
```

---

## Cleanup & Reset

Remove containers, images, volumes:

```bash
docker system prune -a --volumes
```

Fresh start:

```bash
docker-compose down -v
docker-compose up -d --build
```

---

## Troubleshooting Checklist

- All containers show **Up**
- Backend health endpoint responds
- Ports 3000, 3001, 8000, 5432 are free
- Dashboard & checkout load correctly
- Orders and payments function
- Transactions appear in dashboard
