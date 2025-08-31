import pool from "../config/database.js";

class TransactionLock {
  static async acquire(resourceType, resourceId, lockedAmount, expiresAt) {
    try {
      const [result] = await pool.execute(
        "INSERT INTO transaction_locks (resource_type, resource_id, locked_amount, expires_at) VALUES (?, ?, ?, ?)",
        [resourceType, resourceId, lockedAmount, expiresAt]
      );
      return result.insertId;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return null; // Lock already exists
      }
      throw error;
    }
  }

  static async release(resourceType, resourceId) {
    const [result] = await pool.execute(
      "DELETE FROM transaction_locks WHERE resource_type = ? AND resource_id = ?",
      [resourceType, resourceId]
    );
    return result.affectedRows > 0;
  }

  static async findActive(resourceType, resourceId) {
    const [rows] = await pool.execute(
      "SELECT * FROM transaction_locks WHERE resource_type = ? AND resource_id = ? AND expires_at > NOW()",
      [resourceType, resourceId]
    );
    return rows[0];
  }

  static async deleteExpired() {
    const [result] = await pool.execute(
      "DELETE FROM transaction_locks WHERE expires_at < NOW()"
    );
    return result.affectedRows;
  }
}

export default TransactionLock;
