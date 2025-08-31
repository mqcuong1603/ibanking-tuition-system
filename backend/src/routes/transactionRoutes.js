import express from "express";
import { body } from "express-validator";
import {
  createTransaction,
  confirmTransaction,
  getTransactionHistory,
} from "../controllers/transactionController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkLock } from "../middleware/lockMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

// Create transaction
router.post(
  "/create",
  [
    authenticate,
    body("student_id").notEmpty().withMessage("Student ID is required"),
    validateRequest,
    checkLock,
  ],
  createTransaction
);

// Confirm transaction with OTP
router.post(
  "/confirm",
  [
    authenticate,
    body("transaction_id").isInt().withMessage("Invalid transaction ID"),
    body("otp_code")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
    validateRequest,
  ],
  confirmTransaction
);

// Get transaction history
router.get("/history", authenticate, getTransactionHistory);

export default router;
