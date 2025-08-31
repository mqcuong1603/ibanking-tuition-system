import express from "express";
import authRoutes from "./authRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import studentRoutes from "./studentRoutes.js";
import { resendOTP } from "../controllers/otpController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

// Routes
router.use("/auth", authRoutes);
router.use("/transactions", transactionRoutes);
router.use("/students", studentRoutes);

// OTP resend route
router.post(
  "/otp/resend",
  [
    authenticate,
    body("transaction_id").isInt().withMessage("Invalid transaction ID"),
    validateRequest,
  ],
  resendOTP
);

export default router;
