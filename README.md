# iBanking Tuition Payment System

## Description

Hệ thống thanh toán học phí trực tuyến cho sinh viên TDTU thông qua iBanking.

## Features

- Đăng nhập/xác thực người dùng
- Tra cứu thông tin học phí sinh viên
- Thanh toán học phí trực tuyến
- Xác thực giao dịch qua OTP email
- Lịch sử giao dịch
- Cơ chế khóa giao dịch tránh conflict

## Tech Stack

- Backend: Node.js, Express.js
- Database: MySQL
- Authentication: JWT
- Email: Nodemailer
- Frontend: HTML, CSS, JavaScript

## Installation

### Prerequisites

- Node.js v18+
- MySQL 8.0+
- Docker & Docker Compose (optional)

### Using Docker

```bash
# Clone repository
git clone <repository-url>
cd ibanking-tuition-system

# Create .env file
cp backend/.env.example backend/.env
# Edit .env with your configuration

# Run with Docker Compose
docker-compose up -d
```

### Manual Installation

```bash
# Clone repository
git clone <repository-url>
cd ibanking-tuition-system

# Install backend dependencies
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run init-db

# Start server
npm start
# Or development mode
npm run dev
```

## API Endpoints

### Authentication

- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile
- POST /api/auth/logout - User logout

### Transactions

- POST /api/transactions/create - Create new transaction
- POST /api/transactions/confirm - Confirm transaction with OTP
- GET /api/transactions/history - Get transaction history

### Students

- GET /api/students/:student_id - Get student info
- GET /api/students/:student_id/payment-status - Check payment status

### OTP

- POST /api/otp/resend - Resend OTP code

## Environment Variables

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ibanking_tuition
DB_USER=root
DB_PASSWORD=your_password
PORT=3000
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Default Test Accounts

- Username: user1 / Password: 123456
- Username: user2 / Password: 123456

## Test Students

- 52100001 - Le Van C (15,000,000 VND - Unpaid)
- 52100002 - Pham Thi D (12,000,000 VND - Unpaid)
- 52100003 - Hoang Van E (18,000,000 VND - Paid)

## License

MIT
