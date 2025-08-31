import dotenv from "dotenv";

dotenv.config();

export const config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || "ibanking_tuition",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  },
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default_secret",
    expiresIn: process.env.JWT_EXPIRE || "24h",
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  otp: {
    expireMinutes: process.env.OTP_EXPIRE_MINUTES || 5,
  },
  client: {
    url: process.env.CLIENT_URL || "http://localhost:5500",
  },
};
