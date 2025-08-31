import pool from "../config/database.js";
import bcrypt from "bcrypt";

class User {
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, username, full_name, phone, email, balance FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async updateBalance(userId, newBalance) {
    const [result] = await pool.execute(
      "UPDATE users SET balance = ? WHERE id = ?",
      [newBalance, userId]
    );
    return result.affectedRows > 0;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async create(userData) {
    const { username, password, full_name, phone, email } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      "INSERT INTO users (username, password, full_name, phone, email) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, full_name, phone, email]
    );

    return result.insertId;
  }
}

export default User;
