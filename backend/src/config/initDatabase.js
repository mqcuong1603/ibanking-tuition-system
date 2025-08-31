import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const initDatabase = async () => {
  try {
    // Connect without database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Create database
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    await connection.execute(`USE ${process.env.DB_NAME}`);

    // Create users table
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                email VARCHAR(100) NOT NULL,
                balance DECIMAL(15,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_username (username)
            )
        `);

    // Create students table
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS students (
                student_id VARCHAR(20) PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                tuition_amount DECIMAL(15,2) NOT NULL,
                is_paid BOOLEAN DEFAULT FALSE,
                INDEX idx_is_paid (is_paid)
            )
        `);

    // Create transactions table
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                payer_id INT NOT NULL,
                student_id VARCHAR(20) NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                status ENUM('pending', 'otp_sent', 'completed', 'failed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP NULL,
                FOREIGN KEY (payer_id) REFERENCES users(id),
                FOREIGN KEY (student_id) REFERENCES students(student_id),
                INDEX idx_status (status),
                INDEX idx_payer (payer_id),
                INDEX idx_student (student_id)
            )
        `);

    // Create otp_codes table
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS otp_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                transaction_id INT NOT NULL,
                otp_code VARCHAR(6) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                is_used BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (transaction_id) REFERENCES transactions(id),
                UNIQUE KEY unique_otp (transaction_id, otp_code),
                INDEX idx_expires (expires_at)
            )
        `);

    // Create transaction_history table
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS transaction_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                transaction_id INT NOT NULL,
                balance_before DECIMAL(15,2) NOT NULL,
                balance_after DECIMAL(15,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (transaction_id) REFERENCES transactions(id),
                INDEX idx_user (user_id),
                INDEX idx_transaction (transaction_id)
            )
        `);

    // Create transaction_locks table
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS transaction_locks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                resource_type ENUM('user_account', 'student_tuition') NOT NULL,
                resource_id VARCHAR(50) NOT NULL,
                locked_amount DECIMAL(15,2),
                expires_at TIMESTAMP NOT NULL,
                UNIQUE KEY unique_lock (resource_type, resource_id),
                INDEX idx_expires (expires_at)
            )
        `);

    // Insert sample data
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Insert sample users
    await connection.execute(
      `
            INSERT IGNORE INTO users (username, password, full_name, phone, email, balance) VALUES
            ('user1', ?, 'Nguyen Van A', '0901234567', 'cuongcfvipss5@gmail.com', 5000000),
            ('user2', ?, 'Tran Thi B', '0907654321', 'mqcuong1603@gmail.com', 10000000)
        `,
      [hashedPassword, hashedPassword]
    );

    // Insert sample students
    await connection.execute(`
            INSERT IGNORE INTO students (student_id, full_name, tuition_amount, is_paid) VALUES
            ('52100001', 'Le Van C', 15000000, FALSE),
            ('52100002', 'Pham Thi D', 12000000, FALSE),
            ('52100003', 'Hoang Van E', 18000000, FALSE)
        `);

    console.log("Database initialized successfully!");
    await connection.end();
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

initDatabase();
