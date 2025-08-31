import pool from "../config/database.js";
import { TRANSACTION_STATUS } from "../config/constants.js";

class Transaction {
  static async create(payerId, studentId, amount) {
    const [result] = await pool.execute(
      "INSERT INTO transactions (payer_id, student_id, amount, status) VALUES (?, ?, ?, ?)",
      [payerId, studentId, amount, TRANSACTION_STATUS.PENDING]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM transactions WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async updateStatus(id, status, completedAt = null) {
    const query = completedAt
      ? "UPDATE transactions SET status = ?, completed_at = ? WHERE id = ?"
      : "UPDATE transactions SET status = ? WHERE id = ?";

    const params = completedAt ? [status, completedAt, id] : [status, id];

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      `
            SELECT t.*, s.full_name as student_name 
            FROM transactions t
            JOIN students s ON t.student_id = s.student_id
            WHERE t.payer_id = ?
            ORDER BY t.created_at DESC
        `,
      [userId]
    );
    return rows;
  }

  static async findPendingByStudent(studentId) {
    const [rows] = await pool.execute(
      "SELECT * FROM transactions WHERE student_id = ? AND status IN (?, ?)",
      [studentId, TRANSACTION_STATUS.PENDING, TRANSACTION_STATUS.OTP_SENT]
    );
    return rows;
  }
}

export default Transaction;
