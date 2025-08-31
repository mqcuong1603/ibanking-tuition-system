import Transaction from "../models/Transaction.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import TransactionHistory from "../models/TransactionHistory.js";
import {
  TRANSACTION_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../config/constants.js";
import { sendOTP } from "../services/otpService.js";
import { acquireLock, releaseLock } from "../services/lockService.js";
import { verifyOTP } from "../services/otpService.js";
import { sendTransactionEmail } from "../services/emailService.js";
import pool from "../config/database.js";

export const createTransaction = async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const { student_id } = req.body;
    const userId = req.user.id;

    // Start transaction
    await connection.beginTransaction();

    // Check student
    const student = await Student.findById(student_id);
    if (!student) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.STUDENT_NOT_FOUND,
      });
    }

    // Check if tuition already paid
    if (student.is_paid) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.TUITION_ALREADY_PAID,
      });
    }

    // Try to acquire lock
    const lockAcquired = await acquireLock(
      "student_tuition",
      student_id,
      student.tuition_amount
    );
    if (!lockAcquired) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: ERROR_MESSAGES.TRANSACTION_LOCKED,
      });
    }

    // Check user balance
    const user = await User.findById(userId);
    if (user.balance < student.tuition_amount) {
      await releaseLock("student_tuition", student_id);
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INSUFFICIENT_BALANCE,
      });
    }

    // Create transaction
    const transactionId = await Transaction.create(
      userId,
      student_id,
      student.tuition_amount
    );

    // Send OTP
    const otpSent = await sendOTP(transactionId, user.email);

    if (otpSent) {
      await Transaction.updateStatus(
        transactionId,
        TRANSACTION_STATUS.OTP_SENT
      );
      await connection.commit();

      res.json({
        success: true,
        message: SUCCESS_MESSAGES.OTP_SENT,
        data: {
          transaction_id: transactionId,
          student_info: {
            student_id: student.student_id,
            full_name: student.full_name,
            tuition_amount: student.tuition_amount,
          },
        },
      });
    } else {
      await releaseLock("student_tuition", student_id);
      await connection.rollback();

      res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const confirmTransaction = async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const { transaction_id, otp_code } = req.body;
    const userId = req.user.id;

    await connection.beginTransaction();

    // Get transaction
    const transaction = await Transaction.findById(transaction_id);
    if (!transaction || transaction.payer_id !== userId) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Verify OTP
    const isValidOTP = await verifyOTP(transaction_id, otp_code);
    if (!isValidOTP) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_OTP,
      });
    }

    // Get user and student info
    const user = await User.findById(userId);
    const student = await Student.findById(transaction.student_id);

    // Process payment
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore - transaction.amount;

    // Update user balance
    await User.updateBalance(userId, balanceAfter);

    // Update student payment status
    await Student.updatePaymentStatus(transaction.student_id, true);

    // Update transaction status
    await Transaction.updateStatus(
      transaction_id,
      TRANSACTION_STATUS.COMPLETED,
      new Date()
    );

    // Record transaction history
    await TransactionHistory.create(
      userId,
      transaction_id,
      balanceBefore,
      balanceAfter
    );

    // Release lock
    await releaseLock("student_tuition", transaction.student_id);

    // Send confirmation email
    await sendTransactionEmail(user.email, {
      transaction_id,
      student_name: student.full_name,
      student_id: student.student_id,
      amount: transaction.amount,
      balance_after: balanceAfter,
    });

    await connection.commit();

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.TRANSACTION_SUCCESS,
      data: {
        transaction_id,
        balance_after: balanceAfter,
      },
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.findByUser(userId);

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};
