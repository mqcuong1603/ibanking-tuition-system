import pool from "../config/database.js";

class OtpCode {
  static async create(transactionId, otpCode, expiresAt) {
    const [result] = await pool.execute(
      "INSERT INTO otp_codes (transaction_id, otp_code, expires_at) VALUES (?, ?, ?)",
      [transactionId, otpCode, expiresAt]
    );
    return result.insertId;
  }

  static async findValid(transactionId, otpCode) {
    const [rows] = await pool.execute(
      "SELECT * FROM otp_codes WHERE transaction_id = ? AND otp_code = ? AND is_used = FALSE AND expires_at > NOW()",
      [transactionId, otpCode]
    );
    return rows[0];
  }

  static async markAsUsed(id) {
    const [result] = await pool.execute(
      "UPDATE otp_codes SET is_used = TRUE WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  static async deleteExpired() {
    const [result] = await pool.execute(
      "DELETE FROM otp_codes WHERE expires_at < NOW()"
    );
    return result.affectedRows;
  }
}

export default OtpCode;
