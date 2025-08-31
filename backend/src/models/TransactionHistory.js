import pool from "../config/database.js";

class TransactionHistory {
  static async create(userId, transactionId, balanceBefore, balanceAfter) {
    const [result] = await pool.execute(
      "INSERT INTO transaction_history (user_id, transaction_id, balance_before, balance_after) VALUES (?, ?, ?, ?)",
      [userId, transactionId, balanceBefore, balanceAfter]
    );
    return result.insertId;
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM transaction_history WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  }

  static async findByTransaction(transactionId) {
    const [rows] = await pool.execute(
      "SELECT * FROM transaction_history WHERE transaction_id = ?",
      [transactionId]
    );
    return rows[0];
  }
}

export default TransactionHistory;
