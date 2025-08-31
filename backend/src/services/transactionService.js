import pool from "../config/database.js";
import Transaction from "../models/Transaction.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import TransactionHistory from "../models/TransactionHistory.js";
import { TRANSACTION_STATUS } from "../config/constants.js";

export const processPayment = async (transactionId, userId) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get transaction details
    const transaction = await Transaction.findById(transactionId);
    const user = await User.findById(userId);
    const student = await Student.findById(transaction.student_id);

    // Calculate new balance
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore - transaction.amount;

    // Update user balance
    await User.updateBalance(userId, balanceAfter);

    // Update student payment status
    await Student.updatePaymentStatus(transaction.student_id, true);

    // Update transaction status
    await Transaction.updateStatus(
      transactionId,
      TRANSACTION_STATUS.COMPLETED,
      new Date()
    );

    // Record history
    await TransactionHistory.create(
      userId,
      transactionId,
      balanceBefore,
      balanceAfter
    );

    await connection.commit();

    return {
      success: true,
      balance_after: balanceAfter,
      student_name: student.full_name,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
