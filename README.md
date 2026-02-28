# Payment Gateway

A full-featured payment gateway application inspired by Razorpay and Stripe. This project demonstrates real-world payment processing workflows including UPI and Card payments, merchant dashboards, hosted checkout pages, secure API authentication, and a fully Dockerized one-command deployment.

The system is designed to showcase backend API design, payment validation logic, frontend dashboards, and production-ready containerized deployment.

---

##  Features

- Multi-method payment processing (UPI & Card)
- Merchant dashboard with transaction history and statistics
- Hosted and responsive checkout page
- Secure API key & secret based authentication
- Payment validations:
  - UPI VPA format validation
  - Luhn algorithm for card numbers
  - Card network detection
- Docker & Docker Compose based deployment
- PostgreSQL database with proper schema and relationships
- Pre-seeded test merchant credentials for quick evaluation

---

##  Tech Stack

Backend: Node.js, Express.js, PostgreSQL 15, node-postgres (pg)  
Frontend: React 18, Vite, React Router v6, Axios, Custom CSS  
DevOps: Docker, Docker Compose, Nginx  

---

##  Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- Git

---

##  Quick Start

Clone the repository and start all services using a single command:

```bash
git clone https://github.com/sailajabevara/payment-gateway
cd payment-gateway
docker-compose up -d
## Application URLs

Merchant Dashboard: http://localhost:3000  
Checkout Page: http://localhost:3001  
Backend API: http://localhost:8000  
Health Check: http://localhost:8000/health  

---

##  Test Credentials

### Merchant Login
Email: test@example.com  
Password: Any password  

### API Credentials
API Key: key_test_abc123  
API Secret: secret_test_xyz789  

---

##  Test Payment Details

### Cards
Visa: 4111111111111111  
Mastercard: 5555555555554444  
Expiry: Any future date (e.g., 12/25)  
CVV: Any 3 digits (e.g., 123)  

### UPI
Format: username@bank  
Examples: test@paytm, user@upi  

---

##  Payment Flow

1. Merchant creates an order from dashboard or API  
2. Customer is redirected to the hosted checkout page  
3. Customer selects payment method (UPI or Card)  
4. Payment is created with status `processing`  
5. System simulates bank processing delay (5–10 seconds)  
6. Payment status updates to `success` or `failed`  

UPI payments have a simulated 90% success rate, while card payments have a 95% success rate.

---

##  API Overview

Base URL:
http://localhost:8000  

### Public Endpoints
GET /health  
GET /api/v1/test/merchant  
GET /api/v1/orders/{order_id}/public  
POST /api/v1/payments/public  
GET /api/v1/payments/{payment_id}/public  

### Protected Endpoints (API Key & Secret Required)
POST /api/v1/orders  
GET /api/v1/orders/{order_id}  
POST /api/v1/payments  
GET /api/v1/payments/{payment_id}  
GET /api/v1/payments/list  
GET /api/v1/payments/stats  

---
### Project Structure
``` bash
payment-gateway/
├── docker-compose.yml          # Docker orchestration configuration
├── README.md                   # This file
├── .env.example               # Environment variables template
│
├── backend/                    # Backend API service
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # Database connection & initialization
│   │   ├── controllers/
│   │   │   ├── orderController.js      # Order management
│   │   │   ├── paymentController.js    # Payment processing
│   │   │   ├── dashboardController.js  # Stats & history
│   │   │   └── healthController.js     # Health checks
│   │   ├── routes/
│   │   │   └── index.js       # API route definitions
│   │   ├── services/
│   │   │   └── validation.js  # Payment validation logic
│   │   └── index.js           # Application entry point
│   └── .dockerignore
│
├── frontend/                   # Merchant Dashboard (React)
│   ├── Dockerfile
│   ├── nginx.conf             # Nginx configuration
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Dashboard.jsx  # Dashboard home
│   │   │   └── Transactions.jsx # Transaction history
│   │   ├── styles/
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.css
│   │   │   └── Transactions.css
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   └── .dockerignore
│
└── checkout-page/              # Checkout Page (React)
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── pages/
    │   │   └── Checkout.jsx   # Payment checkout flow
    │   ├── styles/
    │   │   └── Checkout.css
    │   ├── App.jsx
    │   └── main.jsx
    └── .dockerignore
```



##  Database Schema Overview

The application uses PostgreSQL with three main tables:

Merchants table stores merchant profile and API credentials.  
Orders table stores payment orders created by merchants.  
Payments table stores payment transaction details and status.  

All tables are connected using proper foreign key relationships to ensure data integrity.

---

##  Security Features

- API key and secret based authentication for all protected endpoints  
- Card CVV and full card numbers are never stored  
- Card numbers are masked and only last 4 digits are saved  
- UPI VPA and card details validated before processing  
- Sensitive configuration handled via environment variables  
- Test mode support for evaluation and automation  

---

## Tech Stack
- Backend: Java / Spring Boot
- Frontend: React
- Database: PostgreSQL
- Containerization: Docker


##  Maintenance Commands

Stop all services:
```bash
docker-compose down

## Restart Services

docker-compose restart
 Restart individual services if needed:
    docker-compose restart api
    docker-compose restart dashboard
    docker-compose restart checkout
    docker-compose restart postgres

##  Rebuild Services

docker-compose down
docker-compose up -d --build
Rebuild a specific service:
docker-compose up -d --build api

## Services Management, Cleaning & Troubleshooting

This section explains how to manage all Docker services for the Payment Gateway application, including viewing logs, restarting services, rebuilding containers, cleaning unused Docker resources, resetting the system, and troubleshooting common issues.

VIEW LOGS  
View logs for all running services:  
$ docker-compose logs -f  

View logs for individual services:  
$ docker-compose logs -f api  
$ docker-compose logs -f dashboard  
$ docker-compose logs -f checkout  
$ docker-compose logs -f postgres  

RESTART SERVICES  
Restart all running services:  
$ docker-compose restart  

Restart specific services if needed:  
$ docker-compose restart api  
$ docker-compose restart dashboard  
$ docker-compose restart checkout  
$ docker-compose restart postgres  

REBUILD SERVICES  
Rebuild and restart all services:  
$ docker-compose down  
$ docker-compose up -d --build  

Rebuild a single service:  
$ docker-compose up -d --build api  

CLEANING (DOCKER CLEANUP)  
Remove stopped containers:  
$ docker container prune  

Remove unused Docker images:  
$ docker image prune -a  

Remove unused volumes:  
$ docker volume prune  

Remove unused networks:  
$ docker network prune  

Remove ALL unused Docker data (containers, images, volumes, networks):  
$ docker system prune -a --volumes  

STOP & CLEAN APPLICATION  
Stop all running services:  
$ docker-compose down  

Stop services and remove database volumes (data reset):  
$ docker-compose down -v  

FULL RESET (FRESH START)  
Completely reset the application, database, and rebuild everything from scratch:  
$ docker-compose down -v  
$ docker-compose up -d --build  

TROUBLESHOOTING  
If services are not starting correctly, check logs first:  
$ docker-compose logs  

Ensure required ports are free and not already in use:  
3000 – Merchant Dashboard  
3001 – Checkout Page  
8000 – Backend API  
5432 – PostgreSQL  

If database connection issues occur, restart database and API:  
$ docker-compose restart postgres  
(wait 10 seconds)  
$ docker-compose restart api  

If frontend applications do not load, clear browser cache (Ctrl + Shift + R) or rebuild frontend services:  
$ docker-compose up -d --build dashboard  
$ docker-compose up -d --build checkout  

SERVICE VERIFICATION CHECKLIST  
- All Docker containers show status "Up"  
- Backend health endpoint responds correctly  
- Merchant dashboard loads on port 3000  
- Checkout page loads on port 3001  
- Backend API responds on port 8000  
- Orders can be created successfully  
- UPI and Card payment flows work correctly  
- Transactions appear correctly in dashboard  
 

The demo shows Docker startup, merchant login, order creation, UPI & card payments, payment status updates, and transaction history.

FINAL STATUS  
✔ All services operational  
✔ Docker setup verified  
✔ Cleaning & reset tested  
✔ API endpoints validated  
✔ Payment workflows verified  
✔ Ready for evaluation and submission