import pool from "../config/database.js";

class Student {
  static async findById(studentId) {
    const [rows] = await pool.execute(
      "SELECT * FROM students WHERE student_id = ?",
      [studentId]
    );
    return rows[0];
  }

  static async updatePaymentStatus(studentId, isPaid) {
    const [result] = await pool.execute(
      "UPDATE students SET is_paid = ? WHERE student_id = ?",
      [isPaid, studentId]
    );
    return result.affectedRows > 0;
  }

  static async findUnpaidStudents() {
    const [rows] = await pool.execute(
      "SELECT * FROM students WHERE is_paid = FALSE"
    );
    return rows;
  }
}

export default Student;
